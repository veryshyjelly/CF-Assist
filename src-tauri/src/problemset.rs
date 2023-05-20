use crate::problem::{MyCfResult, Problem, Problemset, SolvedResult};
use reqwest::Client;
use std::{
    collections::HashSet,
    fs,
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
pub async fn fetch_solved(problemset: tauri::State<'_, ProblemsetState>) -> Result<bool, String> {
    let dir = problemset.0.lock().unwrap().directory.clone();
    let solved_file: PathBuf = Path::new(&dir).into();
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
    let p = problemset.0.lock().unwrap().filtered_problem
        [problemset.0.lock().unwrap().current_index]
        .clone();
    problemset.0.lock().unwrap().solved.insert(p);
    Ok(())
}