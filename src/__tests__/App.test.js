import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("App Component", () => {
  test("displays question prompts after fetching", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/View Questions/));
    
    expect(await screen.findByText(/lorem testum 1/)).toBeInTheDocument();
    expect(await screen.findByText(/lorem testum 2/)).toBeInTheDocument();
  });

  test("creates a new question when the form is submitted", async () => {
    render(<App />);
    await screen.findByText(/lorem testum 2/);

    fireEvent.click(screen.getByText("New Question"));
    
    fireEvent.change(screen.getByLabelText(/Prompt/), {
      target: { value: "New Test Question" }
    });
    fireEvent.change(screen.getByLabelText(/Answer 1/), {
      target: { value: "Answer 1" }
    });
    fireEvent.change(screen.getByLabelText(/Answer 2/), {
      target: { value: "Answer 2" }
    });
    fireEvent.change(screen.getByLabelText(/Correct Answer/), {
      target: { value: "1" }
    });

    fireEvent.submit(screen.getByText(/Add Question/));
    fireEvent.click(screen.getByText(/View Questions/));

    expect(await screen.findByText(/New Test Question/)).toBeInTheDocument();
    expect(screen.getByText(/lorem testum 2/)).toBeInTheDocument();
  });

  test("deletes the question when the delete button is clicked", async () => {
    const { rerender } = render(<App />);
    fireEvent.click(screen.getByText(/View Questions/));
    
    await screen.findByText(/lorem testum 1/);
    const deleteButtons = screen.getAllByText("Delete Question");
    fireEvent.click(deleteButtons[0]);

    await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/));
    rerender(<App />);

    expect(screen.queryByText(/lorem testum 1/)).not.toBeInTheDocument();
    expect(screen.getByText(/lorem testum 2/)).toBeInTheDocument();
  });

  test("updates the answer when the dropdown is changed", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/View Questions/));
    
    await screen.findByText(/lorem testum 2/);
    const dropdowns = await screen.findAllByLabelText(/Correct Answer/);
    expect(dropdowns.length).toBeGreaterThan(0);

    const firstDropdown = dropdowns[0];
    // After previous tests, the first question has correctIndex 2
    expect(firstDropdown.value).toBe("2");

    fireEvent.change(firstDropdown, { target: { value: "3" } });
    
    await waitFor(() => {
      expect(firstDropdown.value).toBe("3");
    });

    // Verify persistence
    fireEvent.click(screen.getByText(/New Question/));
    fireEvent.click(screen.getByText(/View Questions/));
    
    const updatedDropdowns = await screen.findAllByLabelText(/Correct Answer/);
    await waitFor(() => {
      expect(updatedDropdowns[0].value).toBe("3");
    });
  });
});
