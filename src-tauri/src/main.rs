// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod problem;
mod problemset;
mod testcase;

use problemset::*;

fn main() {
    tauri::Builder::default()
        .manage(ProblemsetState::new())
        .invoke_handler(tauri::generate_handler![
            get_problemset,
            set_directory,
            set_tags,
            set_rating,
            filter_problems,
            get_problem,
            next_problem,
            prev_problem,
            fetch_solved,
            problem_solved,
            create_solved,
            sort_problems,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
