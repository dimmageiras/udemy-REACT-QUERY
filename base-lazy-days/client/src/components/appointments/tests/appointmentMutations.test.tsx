import { Calendar } from "../Calendar";

import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@/test-utils";

describe("Reserve appointment", () => {
  it("Reserve appointment", async () => {
    render(<Calendar />);

    // find all the appointments
    const appointments = await screen.findAllByRole("button", {
      name: /\d\d? [ap]m\s+(scrub|facial|massage)/i,
    });

    const fireEventClick = fireEvent.click;

    // click on the first one to reserve
    fireEventClick(appointments[0]);

    // check for the toast alert
    const alertToast = await screen.findByRole("status");

    expect(alertToast).toHaveTextContent("reserve");

    // close alert to keep state clean and wait for it to disappear
    const alertCloseButton = screen.getByRole("button", { name: "Close" });

    fireEventClick(alertCloseButton);

    await waitForElementToBeRemoved(alertToast);
  });
});
