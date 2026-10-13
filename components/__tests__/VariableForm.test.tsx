import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VariableForm } from "../features/VariableForm";

afterEach(cleanup);

describe("VariableForm", () => {
  it("explains how to add variables when the schema is empty", () => {
    render(<VariableForm schema={{}} values={{}} onChange={() => {}} />);
    expect(screen.getByText(/no variables/i)).toBeInTheDocument();
  });

  it("renders one control per variable using labels and a required marker", () => {
    render(
      <VariableForm
        schema={{
          product: { type: "text", required: true },
          tone: { type: "select", label: "Voice", options: ["formal", "casual"] },
          notes: { type: "textarea" },
          agree: { type: "checkbox" },
        }}
        values={{}}
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/Product \*/)).toBeInTheDocument();
    expect(screen.getByLabelText("Voice")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "casual" })).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("reports changes by variable name", () => {
    const onChange = vi.fn();
    render(<VariableForm schema={{ product: { type: "text" } }} values={{ product: "" }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Product"), { target: { value: "Lamp" } });
    expect(onChange).toHaveBeenCalledWith("product", "Lamp");
  });

  it("reports checkbox state as a string", () => {
    const onChange = vi.fn();
    render(<VariableForm schema={{ agree: { type: "checkbox" } }} values={{ agree: "false" }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("agree", "true");
  });

  it("shows field errors", () => {
    render(
      <VariableForm
        schema={{ product: { type: "text", required: true } }}
        values={{ product: "" }}
        errors={{ product: "Product is required" }}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Product is required")).toBeInTheDocument();
  });
});
