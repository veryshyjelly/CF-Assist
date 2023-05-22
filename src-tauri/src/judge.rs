use std::{
    io::Write,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use serde::{Deserialize, Serialize};

use crate::testcase::Testcase;

#[derive(Debug, Serialize, Deserialize)]
pub struct Verdict {
    verdict: String,
    output: String,
}

impl Verdict {
    fn new(verdict: String, output: String) -> Verdict {
        Verdict { verdict, output }
    }
}

pub fn compile_solution(dir: &String, name: &String) -> Result<PathBuf, String> {
    let file_name = name
        .to_lowercase()
        .trim()
        .split(" ")
        .collect::<Vec<&str>>()
        .join("_");

    let mut sol_file: PathBuf = Path::new(&(dir.clone() + "/src/bin")).into();
    let mut out_file: PathBuf = Path::new(&(dir.clone() + "/dist")).into();
    sol_file.push(&(file_name.clone() + ".rs"));
    out_file.push(&(file_name + ".exe"));

    if !sol_file.is_file() {
        return Err("couldn't file solution file".to_string());
    }

    match Command::new("rustc")
        .current_dir(dir)
        .arg(sol_file)
        .arg("-o")
        .arg(out_file.clone())
        .status()
    {
        Ok(_) => Ok(out_file),
        Err(e) => Err(format!("unable to compile with error {}", e)),
    }
}

pub fn test_solution(
    dir: &String,
    name: &String,
    cases: Vec<Testcase>,
) -> Result<Vec<Verdict>, String> {
    let compiled_file = match compile_solution(dir, name) {
        Ok(v) => v,
        Err(e) => return Err(e),
    };

    let mut result = vec![];

    for case in cases {
        let mut sol_process = Command::new(compiled_file.clone())
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();
        sol_process
            .stdin
            .take()
            .unwrap()
            .write_fmt(format_args!("{}", case.input))
            .unwrap();
        let sol_output = String::from_utf8(sol_process.wait_with_output().unwrap().stdout)
            .unwrap()
            .trim()
            .to_string();
        result.push(match sol_output.eq(&case.output) {
            true => Verdict::new("Accepted".to_string(), sol_output),
            false => Verdict::new("Wrong Answer".to_string(), sol_output),
        });
    }

    Ok(result)
}
