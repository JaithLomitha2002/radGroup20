test("should edit hotel", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`);
  
    await page.getByRole("link", { name: "View Details" }).first().click();
  
    await page.waitForSelector('[name="name"]', { state: "attached" });
    await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");
    await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible();
  
    await page.reload();
  
    await expect(page.locator('[name="name"]')).toHaveValue(
      "Dublin Getaways UPDATED"
    );
    await page.locator('[name="name"]').fill("Dublin Getaways");
    await page.getByRole("button", { name: "Save" }).click();
  });