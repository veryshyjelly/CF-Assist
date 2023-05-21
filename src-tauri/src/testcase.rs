use reqwest::Client;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Testcase {
    pub input: String,
    pub output: String,
}

impl Default for Testcase {
    fn default() -> Self {
        Testcase {
            input: "".to_string(),
            output: "".to_string(),
        }
    }
}

pub async fn get_testcases(
    contest_id: i64,
    index: &String,
) -> Result<Vec<Testcase>, reqwest::Error> {
    let document = Html::parse_document(
        &Client::new()
            .get(format!(
                "https://codeforces.com/problemset/problem/{}/{}",
                contest_id, index
            ))
            .send()
            .await?
            .text()
            .await?,
    );

    let input_selector = Selector::parse(".input").unwrap();
    let output_selector = Selector::parse(".output").unwrap();
    let text_selector = Selector::parse("pre").unwrap();

    let mut inputs: Vec<String> = vec![];
    let mut outputs: Vec<String> = vec![];

    document.select(&input_selector).for_each(|element| {
        let pre = element.select(&text_selector).nth(0).unwrap();
        inputs.push(format!("{}", pre.text().collect::<Vec<&str>>().join("\n")));
    });
    document.select(&output_selector).for_each(|element| {
        let pre = element.select(&text_selector).nth(0).unwrap();
        outputs.push(format!("{}", pre.text().collect::<Vec<&str>>().join("\n")));
    });

    let mut result: Vec<Testcase> = vec![];
    for i in 0..inputs.len() {
        result.push(Testcase {
            input: inputs[i].clone(),
            output: outputs[i].clone(),
        });
    }

    Ok(result)
}
