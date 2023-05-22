use crate::judge::{test_solution, Verdict};
use crate::problem::{Problem, SolvedResult};
use crate::testcase::Testcase;
use std::{
    collections::{HashMap, HashSet},
    fs::{self, File},
    path::{Path, PathBuf},
};

pub struct Problemset {
    pub problems: Vec<Problem>,
    pub filtered_problem: Vec<Problem>,
    pub solved: HashSet<Problem>,
    pub testcases: HashMap<String, Vec<Testcase>>,
    pub current_index: usize, // current_problem: core::slice::Iter<Problem>,
    pub show_solved: bool,
    pub filter: Filter,
    pub directory: String,
}

pub enum SortProblem {
    AscBySolved,
    DscBySolved,
    AscByRating,
    DscByRating,
}

impl Problemset {
    pub fn new() -> Problemset {
        Problemset {
            problems: vec![],
            filtered_problem: vec![],
            solved: HashSet::new(),
            testcases: HashMap::new(),
            current_index: 0,
            show_solved: true,
            filter: Filter::default(),
            directory: String::new(),
        }
    }
    pub fn set_directory(&mut self, dir: String) -> Result<(), String> {
        if Path::new(&dir).is_dir() {
            println!("directory set to {}", dir);
            self.directory = dir;
            Ok(())
        } else {
            println!("directory not found");
            Err("directory not found".to_string())
        }
    }
    pub fn set_rating(&mut self, min: usize, max: usize) -> Result<(), String> {
        self.filter.rating = (min, max);
        println!("rating set to {}-{}", min, max);
        Ok(())
    }
    pub fn set_tags(&mut self, tags: Vec<String>) -> Result<(), String> {
        println!("tags set {:?}", tags);
        self.filter.tags = tags;
        Ok(())
    }
    pub fn filter_problems(&mut self) -> Result<(), String> {
        self.filtered_problem = self
            .problems
            .clone()
            .into_iter()
            .filter(|p| self.filter.filter(p))
            .collect();
        Ok(())
    }
    pub fn sort_problems(&mut self, sort_type: SortProblem) -> Result<(), String> {
        let sort_function = match sort_type {
            SortProblem::AscBySolved => {
                |x: &Problem, y: &Problem| x.solved_count.cmp(&y.solved_count)
            }
            SortProblem::AscByRating => |x: &Problem, y: &Problem| x.rating.cmp(&y.rating),
            SortProblem::DscBySolved => {
                |x: &Problem, y: &Problem| x.solved_count.cmp(&y.solved_count).reverse()
            }
            SortProblem::DscByRating => {
                |x: &Problem, y: &Problem| x.rating.cmp(&y.rating).reverse()
            }
        };
        self.filtered_problem.sort_by(sort_function);
        Ok(())
    }
    pub fn get_problem(&mut self) -> Result<Problem, String> {
        if !self.show_solved {
            while self.current_index < self.filtered_problem.len()
                && self
                    .solved
                    .contains(&self.filtered_problem[self.current_index])
            {
                self.current_index += 1;
            }
        }
        if (self.show_solved
            || !self
                .solved
                .contains(&self.filtered_problem[self.current_index]))
            && self.filtered_problem.len() > 0
            && self.current_index < self.filtered_problem.len()
        {
            return Ok(self.filtered_problem[self.current_index].clone());
        }
        Err("couldn't get problem".to_string())
    }
    pub fn next_problem(&mut self) -> Result<Problem, String> {
        if self.current_index < self.filtered_problem.len() - 1 {
            self.current_index += 1;
            return Ok(self.filtered_problem[self.current_index].clone());
        }
        Err("problems exhausted".to_string())
    }
    pub fn prev_problem(&mut self) -> Result<Problem, String> {
        if self.current_index > 0 {
            self.current_index -= 1;
        }
        while self.current_index > 0
            && self
                .solved
                .contains(&self.filtered_problem[self.current_index])
        {
            self.current_index -= 1;
        }
        if self.current_index > 0 {
            return Ok(self.filtered_problem[self.current_index].clone());
        }
        Err("no previous problem".to_string())
    }
    pub fn problem_solved(&mut self) -> Result<(), String> {
        let p = self.filtered_problem[self.current_index].clone();
        self.solved.insert(p);

        let dir = self.directory.clone();
        let mut solved_file: PathBuf = Path::new(&dir).into();
        solved_file.push("solved.json");
        let solved_result = serde_json::to_string(&SolvedResult {
            result: self.solved.clone().into_iter().collect(),
        })
        .unwrap();

        match fs::write(solved_file, solved_result) {
            Ok(_) => Ok(()),
            Err(err) => {
                println!("{}", err);
                return Err("error while writing to file".to_string());
            }
        }
    }
    pub fn get_testcase(&self, contest_id: i64, index: &String) -> Option<&Vec<Testcase>> {
        self.testcases.get(&format!("{}{}", contest_id, index))
    }
    pub fn save_testcase(
        &mut self,
        contest_id: i64,
        index: &String,
        cases: Vec<Testcase>,
    ) -> Result<(), String> {
        self.testcases
            .insert(format!("{}{}", contest_id, index), cases);
        Ok(())
    }
    pub fn create_file(&mut self) -> Result<(), String> {
        let mut file_name = self.get_problem()?.name;
        file_name = file_name
            .to_lowercase()
            .trim()
            .split(" ")
            .collect::<Vec<&str>>()
            .join("_")
            + ".rs";
        let mut new_file: PathBuf = Path::new(&(self.directory.clone() + "/src/bin")).into();
        // new_file.push("src/bin");
        new_file.push(&file_name);
        if !new_file.is_file() {
            return match File::create(new_file) {
                Ok(_) => Ok(()),
                Err(err) => Err(format!("error while creating file {}", err)),
            };
        }
        Ok(())
    }
    pub fn open_link(&mut self) -> Result<(), String> {
        let problem = self.get_problem()?;
        let link = format!(
            "https://codeforces.com/problemset/problem/{}/{}",
            problem.contest_id, problem.index
        );
        match open::that(link) {
            Ok(()) => Ok(()),
            Err(err) => Err(format!("An error occurred when opening link {}", err)),
        }
    }
    pub fn judge(&mut self) -> Result<Vec<Verdict>, String> {
        let prob = self.get_problem().unwrap();
        let case = self.get_testcase(prob.contest_id, &prob.index).unwrap();
        let dir = self.directory.clone();
        test_solution(&dir, &prob.name, case.clone())
    }
}

pub struct Filter {
    pub tags: Vec<String>,
    pub rating: (usize, usize),
}

impl Default for Filter {
    fn default() -> Self {
        Filter {
            tags: vec![],
            rating: (800, 3500),
        }
    }
}

impl Filter {
    pub fn filter(&self, p: &Problem) -> bool {
        if p.rating > self.rating.1 || p.rating < self.rating.0 {
            return false;
        }
        for t in &self.tags {
            if !p.tags.contains(t) {
                return false;
            }
        }
        return true;
    }
}
