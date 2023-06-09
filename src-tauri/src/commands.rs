use crate::judge::Verdict;
use crate::problem::{MyCfResult, Problem, SolvedResult};
use crate::problemset::{Problemset, SortProblem};
use crate::testcase::{get_testcases, Testcase};
use reqwest::Client;
use std::{
    collections::HashSet,
    fs,
    io::Write,
    path::{Path, PathBuf},
    sync::Mutex,
};

pub struct ProblemsetState(Mutex<Problemset>);

impl ProblemsetState {
    pub fn new() -> ProblemsetState {
        ProblemsetState(Mutex::new(Problemset::new()))
    }
}

#[tauri::command]
pub async fn get_problemset(problemset: tauri::State<'_, ProblemsetState>) -> Result<(), String> {
    let resp: MyCfResult = serde_json::from_str(
        &Client::new()
            .get("https://codeforces.com/api/problemset.problems/")
            .send()
            .await
            .expect("error while getting data")
            .text()
            .await
            .expect("error while reading data"),
    )
    .expect("error while parsing");

    let mut problems = resp.result.problems;
    for stat in resp.result.problem_statistics {
        problems
            .iter_mut()
            .filter(|x| x.contest_id == stat.contest_id && x.index == stat.index)
            .for_each(|x| x.solved_count = stat.solved_count);
    }

    problemset.0.lock().unwrap().problems = problems;

    // println!("{:?}", problemset.0.lock().unwrap().problems);
    Ok(())
}

#[tauri::command]
pub async fn get_testcase(
    contest_id: i64,
    index: String,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<Vec<Testcase>, String> {
    match problemset
        .0
        .lock()
        .unwrap()
        .get_testcase(contest_id, &index)
    {
        Some(v) => Ok(v.to_vec()),
        None => Err("cannot get testcases".to_string()),
    }
}

#[tauri::command]
pub async fn fetch_testcase(
    contest_id: i64,
    index: String,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<Vec<Testcase>, String> {
    match get_testcases(contest_id, &index).await {
        Ok(v) => Ok({
            problemset
                .0
                .lock()
                .unwrap()
                .save_testcase(contest_id, &index, v.clone())
                .unwrap();
            v
        }),
        Err(_) => Err("cannot get testcases".to_string()),
    }
}

#[tauri::command]
pub async fn fetch_solved(problemset: tauri::State<'_, ProblemsetState>) -> Result<bool, String> {
    let dir = problemset.0.lock().unwrap().directory.clone();
    let mut solved_file: PathBuf = Path::new(&dir).into();
    solved_file.push("solved.json");
    if solved_file.is_file() {
        let mut solved: HashSet<Problem> = HashSet::new();
        serde_json::from_str::<SolvedResult>(&fs::read_to_string(solved_file).unwrap())
            .unwrap()
            .result
            .into_iter()
            .for_each(|p| {
                solved.insert(p);
            });
        problemset.0.lock().unwrap().solved = solved;
    } else {
        return Err("cannot find solved.json file".to_string());
    }
    Ok(true)
}

#[tauri::command]
pub async fn create_solved(problemset: tauri::State<'_, ProblemsetState>) -> Result<(), String> {
    let dir = problemset.0.lock().unwrap().directory.clone();
    let mut solved_file: PathBuf = Path::new(&dir).into();
    solved_file.push("solved.json");
    let mut file = match fs::File::create(solved_file) {
        Ok(file) => file,
        Err(err) => {
            println!("{}", err);
            return Err("error while creating file".to_string());
        }
    };
    let solved_result = SolvedResult {
        result: problemset
            .0
            .lock()
            .unwrap()
            .solved
            .clone()
            .into_iter()
            .collect(),
    };
    match file.write_all(serde_json::to_string(&solved_result).unwrap().as_bytes()) {
        Err(_) => return Err("error while writing to file".to_string()),
        Ok(_) => {}
    };
    Ok(())
}

#[tauri::command]
pub async fn set_directory(
    directory: String,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<(), String> {
    problemset.0.lock().unwrap().set_directory(directory)
}

#[tauri::command]
pub async fn set_rating(
    min: usize,
    max: usize,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<(), String> {
    problemset.0.lock().unwrap().set_rating(min, max)?;
    problemset.0.lock().unwrap().filter_problems()
}

#[tauri::command]
pub async fn set_tags(
    tags: Vec<String>,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<(), String> {
    problemset.0.lock().unwrap().set_tags(tags)?;
    problemset.0.lock().unwrap().filter_problems()
}

#[tauri::command]
pub async fn filter_problems(problemset: tauri::State<'_, ProblemsetState>) -> Result<(), String> {
    problemset.0.lock().unwrap().filter_problems()
}

#[tauri::command]
pub async fn get_problem(problemset: tauri::State<'_, ProblemsetState>) -> Result<Problem, String> {
    problemset.0.lock().unwrap().get_problem()
}

#[tauri::command]
pub async fn next_problem(
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<Problem, String> {
    problemset.0.lock().unwrap().next_problem()
}

#[tauri::command]
pub async fn prev_problem(
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<Problem, String> {
    problemset.0.lock().unwrap().prev_problem()
}

#[tauri::command]
pub async fn problem_solved(problemset: tauri::State<'_, ProblemsetState>) -> Result<(), String> {
    problemset.0.lock().unwrap().problem_solved()
}

#[tauri::command]
pub async fn sort_problems(
    sort_by: String,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<(), String> {
    let sort_function = if sort_by == "DSC_BY_SOLVED" {
        SortProblem::DscBySolved
    } else if sort_by == "ASC_BY_SOLVED" {
        SortProblem::AscBySolved
    } else if sort_by == "DSC_BY_RATING" {
        SortProblem::DscByRating
    } else if sort_by == "ASC_BY_RATING" {
        SortProblem::AscByRating
    } else {
        return Err("invalid sort type".to_string());
    };
    problemset.0.lock().unwrap().sort_problems(sort_function)
}

#[tauri::command]
pub async fn set_hide_solved(
    value: bool,
    problemset: tauri::State<'_, ProblemsetState>,
) -> Result<(), String> {
    problemset.0.lock().unwrap().show_solved = !value;
    println!("show_solved set to {}", value);
    Ok(())
}

#[tauri::command]
pub async fn create_file(problemset: tauri::State<'_, ProblemsetState>) -> Result<(), String> {
    problemset.0.lock().unwrap().create_file()
}

#[tauri::command]
pub async fn open_link(problemset: tauri::State<'_, ProblemsetState>) -> Result<(), String> {
    problemset.0.lock().unwrap().open_link()
}

#[tauri::command]
pub async fn judge(problemset: tauri::State<'_, ProblemsetState>) -> Result<Vec<Verdict>, String> {
    problemset.0.lock().unwrap().judge()
}
