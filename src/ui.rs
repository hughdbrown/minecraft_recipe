use ratatui::{
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    widgets::{Block, Borders, List, ListItem, ListState, Paragraph, Wrap},
    Frame,
};
use std::env;
use std::fs;
use std::io;
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Screen {
    Main,
    Result,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FocusedWidget {
    Directory,
    TxtFile,
    McaddonToggle,
    McaddonFile,
    GoButton,
}

pub struct App {
    pub screen: Screen,
    pub focused_widget: FocusedWidget,
    pub current_directory: PathBuf,
    pub directories: Vec<PathBuf>,
    pub directory_list_state: ListState,
    pub txt_files: Vec<PathBuf>,
    pub txt_file_list_state: ListState,
    pub mcaddon_files: Vec<PathBuf>,
    pub mcaddon_file_list_state: ListState,
    pub use_mcaddon: bool,
    pub result_message: String,
}

impl App {
    pub fn new() -> io::Result<Self> {
        let current_directory = env::current_dir()?;
        let mut app = Self {
            screen: Screen::Main,
            focused_widget: FocusedWidget::Directory,
            current_directory: current_directory.clone(),
            directories: Vec::new(),
            directory_list_state: ListState::default(),
            txt_files: Vec::new(),
            txt_file_list_state: ListState::default(),
            mcaddon_files: Vec::new(),
            mcaddon_file_list_state: ListState::default(),
            use_mcaddon: false,
            result_message: String::new(),
        };

        app.load_directory_contents()?;
        Ok(app)
    }

    fn load_directory_contents(&mut self) -> io::Result<()> {
        // Load parent and subdirectories
        self.directories.clear();

        // Add parent directory if not at root
        if let Some(parent) = self.current_directory.parent() {
            self.directories.push(parent.to_path_buf());
        }

        // Add subdirectories
        for entry in fs::read_dir(&self.current_directory)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                self.directories.push(path);
            }
        }

        // Select first directory by default
        if !self.directories.is_empty() {
            self.directory_list_state.select(Some(0));
        }

        // Load .txt files
        self.txt_files.clear();
        for entry in fs::read_dir(&self.current_directory)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "txt" {
                        self.txt_files.push(path);
                    }
                }
            }
        }

        // Auto-select if only one .txt file
        if self.txt_files.len() == 1 {
            self.txt_file_list_state.select(Some(0));
        } else if !self.txt_files.is_empty() {
            self.txt_file_list_state.select(Some(0));
        }

        // Load .mcaddon files
        self.mcaddon_files.clear();
        for entry in fs::read_dir(&self.current_directory)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "mcaddon" {
                        self.mcaddon_files.push(path);
                    }
                }
            }
        }

        // Auto-select if only one .mcaddon file
        if self.mcaddon_files.len() == 1 {
            self.mcaddon_file_list_state.select(Some(0));
        } else if !self.mcaddon_files.is_empty() {
            self.mcaddon_file_list_state.select(Some(0));
        }

        Ok(())
    }

    pub fn change_directory(&mut self, new_dir: PathBuf) -> io::Result<()> {
        self.current_directory = new_dir;
        self.load_directory_contents()?;
        Ok(())
    }

    pub fn next_widget(&mut self) {
        self.focused_widget = match self.focused_widget {
            FocusedWidget::Directory => FocusedWidget::TxtFile,
            FocusedWidget::TxtFile => FocusedWidget::McaddonToggle,
            FocusedWidget::McaddonToggle => {
                if self.use_mcaddon {
                    FocusedWidget::McaddonFile
                } else {
                    FocusedWidget::GoButton
                }
            }
            FocusedWidget::McaddonFile => FocusedWidget::GoButton,
            FocusedWidget::GoButton => FocusedWidget::Directory,
        };
    }

    pub fn previous_widget(&mut self) {
        self.focused_widget = match self.focused_widget {
            FocusedWidget::Directory => FocusedWidget::GoButton,
            FocusedWidget::TxtFile => FocusedWidget::Directory,
            FocusedWidget::McaddonToggle => FocusedWidget::TxtFile,
            FocusedWidget::McaddonFile => FocusedWidget::McaddonToggle,
            FocusedWidget::GoButton => {
                if self.use_mcaddon {
                    FocusedWidget::McaddonFile
                } else {
                    FocusedWidget::McaddonToggle
                }
            }
        };
    }

    pub fn next_item(&mut self) {
        match self.focused_widget {
            FocusedWidget::Directory => {
                let i = match self.directory_list_state.selected() {
                    Some(i) => {
                        if i >= self.directories.len().saturating_sub(1) {
                            0
                        } else {
                            i + 1
                        }
                    }
                    None => 0,
                };
                self.directory_list_state.select(Some(i));
            }
            FocusedWidget::TxtFile => {
                let i = match self.txt_file_list_state.selected() {
                    Some(i) => {
                        if i >= self.txt_files.len().saturating_sub(1) {
                            0
                        } else {
                            i + 1
                        }
                    }
                    None => 0,
                };
                self.txt_file_list_state.select(Some(i));
            }
            FocusedWidget::McaddonFile => {
                let i = match self.mcaddon_file_list_state.selected() {
                    Some(i) => {
                        if i >= self.mcaddon_files.len().saturating_sub(1) {
                            0
                        } else {
                            i + 1
                        }
                    }
                    None => 0,
                };
                self.mcaddon_file_list_state.select(Some(i));
            }
            _ => {}
        }
    }

    pub fn previous_item(&mut self) {
        match self.focused_widget {
            FocusedWidget::Directory => {
                let i = match self.directory_list_state.selected() {
                    Some(i) => {
                        if i == 0 {
                            self.directories.len().saturating_sub(1)
                        } else {
                            i - 1
                        }
                    }
                    None => 0,
                };
                self.directory_list_state.select(Some(i));
            }
            FocusedWidget::TxtFile => {
                let i = match self.txt_file_list_state.selected() {
                    Some(i) => {
                        if i == 0 {
                            self.txt_files.len().saturating_sub(1)
                        } else {
                            i - 1
                        }
                    }
                    None => 0,
                };
                self.txt_file_list_state.select(Some(i));
            }
            FocusedWidget::McaddonFile => {
                let i = match self.mcaddon_file_list_state.selected() {
                    Some(i) => {
                        if i == 0 {
                            self.mcaddon_files.len().saturating_sub(1)
                        } else {
                            i - 1
                        }
                    }
                    None => 0,
                };
                self.mcaddon_file_list_state.select(Some(i));
            }
            _ => {}
        }
    }

    pub fn execute_python_script(&mut self) {
        // Get selected .txt file
        let txt_file = match self.txt_file_list_state.selected() {
            Some(i) => self.txt_files.get(i),
            None => None,
        };

        if txt_file.is_none() {
            self.result_message = "Error: No .txt file selected".to_string();
            self.screen = Screen::Result;
            return;
        }

        let txt_file = txt_file.unwrap();

        // Build command
        let mut cmd = Command::new("uv");
        cmd.arg("run")
            .arg("minecraft_recipe.py")
            .arg(txt_file);

        // Add mcaddon option if enabled
        if self.use_mcaddon {
            let mcaddon_file = match self.mcaddon_file_list_state.selected() {
                Some(i) => self.mcaddon_files.get(i),
                None => None,
            };

            if let Some(mcaddon) = mcaddon_file {
                cmd.arg("--mcaddon").arg(mcaddon);
            } else {
                self.result_message = "Error: No .mcaddon file selected".to_string();
                self.screen = Screen::Result;
                return;
            }
        }

        // Execute command
        match cmd.output() {
            Ok(output) => {
                if output.status.success() {
                    let stdout = String::from_utf8_lossy(&output.stdout);
                    self.result_message = format!("Success!\n\n{}", stdout);
                } else {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    self.result_message = format!("Error:\n\n{}", stderr);
                }
            }
            Err(e) => {
                self.result_message = format!("Failed to execute command: {}", e);
            }
        }

        self.screen = Screen::Result;
    }
}

pub fn draw(f: &mut Frame, app: &mut App) {
    match app.screen {
        Screen::Main => draw_main_screen(f, app),
        Screen::Result => draw_result_screen(f, app),
    }
}

fn draw_main_screen(f: &mut Frame, app: &mut App) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3),  // Title
            Constraint::Min(5),     // Directory selector
            Constraint::Min(5),     // Txt file selector
            Constraint::Length(3),  // Mcaddon toggle
            Constraint::Min(5),     // Mcaddon file selector
            Constraint::Length(3),  // Go button
            Constraint::Length(2),  // Instructions
        ])
        .split(f.area());

    // Title
    let title = Paragraph::new("Minecraft Recipe Converter")
        .style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD))
        .block(Block::default().borders(Borders::ALL));
    f.render_widget(title, chunks[0]);

    // Directory selector
    let dir_items: Vec<ListItem> = app
        .directories
        .iter()
        .map(|d| {
            let name = if d == app.current_directory.parent().unwrap_or(&app.current_directory) {
                ".. (parent)".to_string()
            } else {
                d.file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string()
            };
            ListItem::new(name)
        })
        .collect();

    let dir_style = if app.focused_widget == FocusedWidget::Directory {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let dir_list = List::new(dir_items)
        .block(
            Block::default()
                .title(format!("Directory: {}", app.current_directory.display()))
                .borders(Borders::ALL)
                .border_style(dir_style),
        )
        .highlight_style(Style::default().bg(Color::DarkGray).add_modifier(Modifier::BOLD))
        .highlight_symbol("> ");

    f.render_stateful_widget(dir_list, chunks[1], &mut app.directory_list_state);

    // Txt file selector
    let txt_items: Vec<ListItem> = app
        .txt_files
        .iter()
        .map(|f| {
            let name = f.file_name().unwrap_or_default().to_string_lossy().to_string();
            ListItem::new(name)
        })
        .collect();

    let txt_style = if app.focused_widget == FocusedWidget::TxtFile {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let txt_list = List::new(txt_items)
        .block(
            Block::default()
                .title("Select .txt file")
                .borders(Borders::ALL)
                .border_style(txt_style),
        )
        .highlight_style(Style::default().bg(Color::DarkGray).add_modifier(Modifier::BOLD))
        .highlight_symbol("> ");

    f.render_stateful_widget(txt_list, chunks[2], &mut app.txt_file_list_state);

    // Mcaddon toggle
    let toggle_text = if app.use_mcaddon {
        "[X] Use .mcaddon file"
    } else {
        "[ ] Use .mcaddon file"
    };

    let toggle_style = if app.focused_widget == FocusedWidget::McaddonToggle {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let toggle = Paragraph::new(toggle_text)
        .block(Block::default().borders(Borders::ALL).border_style(toggle_style));

    f.render_widget(toggle, chunks[3]);

    // Mcaddon file selector (only if enabled)
    if app.use_mcaddon {
        let mcaddon_items: Vec<ListItem> = app
            .mcaddon_files
            .iter()
            .map(|f| {
                let name = f.file_name().unwrap_or_default().to_string_lossy().to_string();
                ListItem::new(name)
            })
            .collect();

        let mcaddon_style = if app.focused_widget == FocusedWidget::McaddonFile {
            Style::default().fg(Color::Yellow)
        } else {
            Style::default()
        };

        let mcaddon_list = List::new(mcaddon_items)
            .block(
                Block::default()
                    .title("Select .mcaddon file")
                    .borders(Borders::ALL)
                    .border_style(mcaddon_style),
            )
            .highlight_style(Style::default().bg(Color::DarkGray).add_modifier(Modifier::BOLD))
            .highlight_symbol("> ");

        f.render_stateful_widget(mcaddon_list, chunks[4], &mut app.mcaddon_file_list_state);
    } else {
        let disabled = Paragraph::new("(disabled)")
            .block(
                Block::default()
                    .title("Select .mcaddon file")
                    .borders(Borders::ALL),
            )
            .style(Style::default().fg(Color::DarkGray));
        f.render_widget(disabled, chunks[4]);
    }

    // Go button
    let go_style = if app.focused_widget == FocusedWidget::GoButton {
        Style::default().fg(Color::Green).add_modifier(Modifier::BOLD)
    } else {
        Style::default().fg(Color::Green)
    };

    let go_button = Paragraph::new("[ GO ]")
        .style(go_style)
        .block(Block::default().borders(Borders::ALL));

    f.render_widget(go_button, chunks[5]);

    // Instructions
    let instructions = Paragraph::new("Tab: Next | Shift+Tab: Previous | Enter: Select/Toggle | Up/Down: Navigate | q/Esc: Quit");
    f.render_widget(instructions, chunks[6]);
}

fn draw_result_screen(f: &mut Frame, app: &mut App) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(5), Constraint::Length(2)])
        .split(f.area());

    let result = Paragraph::new(app.result_message.as_str())
        .block(Block::default().title("Result").borders(Borders::ALL))
        .wrap(Wrap { trim: true });

    f.render_widget(result, chunks[0]);

    let instructions = Paragraph::new("Press Enter, q, or Esc to quit");
    f.render_widget(instructions, chunks[1]);
}
