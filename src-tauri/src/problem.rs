use serde::{Deserialize, Serialize};
use std::hash::{Hash, Hasher};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Problem {
    #[serde(default)]
    pub rating: usize,
    pub contest_id: i64,
    pub index: String,
    pub name: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub solved_count: i64,
}

impl PartialEq for Problem {
    fn eq(&self, other: &Self) -> bool {
        self.contest_id == other.contest_id && self.index == other.index
    }
}

impl Eq for Problem {}

impl Hash for Problem {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.contest_id.hash(state);
        self.index.hash(state);
    }
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
