Feature: API Testing Exercise

  Scenario: Change user email
    When I update user email which has id "5827297"
    Then I verify that the user email has changed

  Scenario: Create and verify new user
    When I create a new user with email "hakobjan@example.com", name "Hakob", gender "male" and status "active"
    Then I verify that the user is created successfully


  Scenario: Delete user
    Given a user with previous email exists
    When I delete the user
    Then the user is successfully deleted