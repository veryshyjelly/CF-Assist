# CF Assist

CF Assist is a desktop application designed to automate and streamline the process of practicing on Codeforces. It provides a user-friendly interface and integrates essential features to enhance the problem-solving experience.

## Features

- **Automated Test Case Fetching:** CF Assist uses web scraping techniques to automatically fetch example test cases for each problem from the Codeforces website.
- **Codeforces API Integration:** The application leverages the Codeforces API to retrieve problem information, including problem ID, title, difficulty level, and tags.
- **Filtering and Sorting:** CF Assist allows users to filter problems based on ratings and tags, enabling them to focus on specific problem sets. It also provides sorting options to organize the problems effectively.
- **Problem Statement Viewing:** Users can open the problem statement in their default web browser directly from CF Assist, providing convenient access to problem details.
- **Solution File Creation:** CF Assist enables users to create solution files in their selected directory within the application. This feature saves time and ensures proper organization of solution files.
- **Solution Testing:** Users can test their solution files against example test cases to validate correctness and efficiency. CF Assist compares the generated output with the expected output, providing immediate feedback on the solution's performance.
- **Solved Problems Database:** CF Assist maintains a database of solved problems, allowing users to track their progress and filter out already solved problems during practice sessions.

## Technologies Used

- Tauri: A framework for building desktop applications using web technologies.
- Next.js: A React framework for server-side rendering and static site generation.
- Tailwind CSS: A utility-first CSS framework for creating responsive and modern UI designs.
- Rust: A systems programming language known for its memory safety, performance, and concurrency features.

## Getting Started

Follow these instructions to set up and run CF Assist on your local machine:

1. Clone the repository: `git clone https://github.com/veryshyjelly/Cf-Assist.git`
2. Install the necessary dependencies: `npm install`
3. Configure the application by editing the relevant configuration files.
4. Build the application: `npm run tauri build`
5. Run the application: `npm run tauri dev`

For detailed instructions and additional configuration options, refer to the [Documentation](https://tauri.app/v1/guides/).

## Contributing

Contributions are welcome! If you would like to contribute to CF Assist, please follow the guidelines outlined in the [Contributing Guide](https://github.com/veryshyejelly/CF-Assist/issues).

## License

[MIT License](link-to-license)

## Acknowledgements

- [Codeforces](https://codeforces.com/): The platform that inspired and provided the problem data for CF Assist.
- [OpenAI](https://openai.com/): The organization behind the powerful GPT-3 language model that helped generate this README template.

## Contact

If you have any questions, suggestions, or feedback, please feel free to reach out to us at [veryshyjelly@gmail.com](mailto:veryshyjelly@gmail.com).

---
