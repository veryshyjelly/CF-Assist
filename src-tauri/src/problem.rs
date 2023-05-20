use std::{
    collections::{BTreeSet, HashSet},
    path::Path,
};

use serde::{Deserialize, Serialize};

pub struct Problemset {
    pub problems: Vec<Problem>,
    pub filtered_problem: Vec<Problem>,
    pub solved: HashSet<Problem>,
    pub current_index: usize, // current_problem: core::slice::Iter<Problem>,
    pub filter: Filter,
    pub directory: String,
}

impl Problemset {
    pub fn new() -> Problemset {
        Problemset {
            problems: vec![],
            filtered_problem: vec![],
            solved: HashSet::new(),
            current_index: 0,
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
    pub fn get_problem(&mut self) -> Result<Problem, String> {
        if self.filtered_problem.len() > 0 && self.current_index < self.filtered_problem.len() {
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
            return Ok(self.filtered_problem[self.current_index].clone());
        }
        Err("no previous problem".to_string())
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
        for t in &p.tags {
            if !self.tags.contains(t) {
                return false;
            }
        }
        return true;
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct Problem {
    pub rating: usize,
    #[serde(default)]
    pub contest_id: i64,
    pub index: String,
    #[serde(default)]
    pub problemset_name: String,
    pub name: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub solved_count: i64,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProblemStatistics {
    #[serde(default)]
    pub contest_id: i64,
    pub index: String,
    pub solved_count: i64,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MyResult {
    #[serde(default)]
    pub problems: Vec<Problem>,
    #[serde(default)]
    pub problem_statistics: Vec<ProblemStatistics>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MyCfResult {
    pub status: String,
    pub result: MyResult,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SolvedResult {
    pub result: Vec<Problem>,
}