use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyEvent},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    Terminal,
};
use std::io;

mod ui;
use ui::{App, FocusedWidget, Screen};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Create app and run it
    let app = App::new()?;
    let res = run_app(&mut terminal, app);

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = res {
        println!("Error: {:?}", err);
    }

    Ok(())
}

fn run_app<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
    mut app: App,
) -> io::Result<()> {
    loop {
        terminal.draw(|f| ui::draw(f, &mut app))?;

        if let Event::Key(key) = event::read()? {
            match app.screen {
                Screen::Main => {
                    if handle_main_screen_input(&mut app, key) {
                        break;
                    }
                }
                Screen::Result => {
                    if handle_result_screen_input(&mut app, key) {
                        break;
                    }
                }
            }
        }
    }
    Ok(())
}

fn handle_main_screen_input(app: &mut App, key: KeyEvent) -> bool {
    match key.code {
        KeyCode::Char('q') | KeyCode::Esc => return true,
        KeyCode::Tab => app.next_widget(),
        KeyCode::BackTab => app.previous_widget(),
        KeyCode::Up => app.previous_item(),
        KeyCode::Down => app.next_item(),
        KeyCode::Enter => match app.focused_widget {
            FocusedWidget::Directory => {
                if let Some(selected) = app.directory_list_state.selected() {
                    if let Some(dir) = app.directories.get(selected) {
                        let _ = app.change_directory(dir.clone());
                    }
                }
            }
            FocusedWidget::TxtFile => {
                // File is already selected in the list
            }
            FocusedWidget::McaddonToggle => {
                app.use_mcaddon = !app.use_mcaddon;
            }
            FocusedWidget::McaddonFile => {
                // File is already selected in the list
            }
            FocusedWidget::GoButton => {
                app.execute_python_script();
            }
        },
        _ => {}
    }
    false
}

fn handle_result_screen_input(_app: &mut App, key: KeyEvent) -> bool {
    match key.code {
        KeyCode::Char('q') | KeyCode::Esc | KeyCode::Enter => return true,
        _ => {}
    }
    false
}
