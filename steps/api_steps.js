'use strict';
const axios = require('axios');
const assert = require('assert');
const token = "Bearer b40093620aaecc6fc0285feb366f20c3f116141942ba852c95a84c03f88cab35";

let userId;
let originalEmail;
let updatedEmail;
let userIdToDelete;

When('I update user email which has id {string}', async (userIdParam) => {
    userId = userIdParam;
    const originalUserResponse = await axios.get(`https://gorest.co.in/public/v2/users/${userId}`, {
        headers: {
            Authorization: token,
        },
    });
    originalEmail = originalUserResponse.data.email;

    console.log('Original Email:', originalEmail);

    const updateResponse = await axios.patch(`https://gorest.co.in/public/v2/users/${userId}`, {
        email: "lalamnats@google.com",
    }, {
        headers: {
            Authorization: token,
        },
    });

    console.log('Update Response:', updateResponse.data);

    assert.strictEqual(updateResponse.status, 200, 'Failed to update user email');

    updatedEmail = updateResponse.data.email;

    console.log('Updated Email:', updatedEmail);
});

Then('I verify that the user email has changed', async () => {

    const updatedUserResponse = await axios.get(`https://gorest.co.in/public/v2/users/${userId}`, {
        headers: {
            Authorization: token,
        },
    });
    const finalUpdatedEmail = updatedUserResponse.data.email;

    assert.notStrictEqual(originalEmail, finalUpdatedEmail, 'User email should have changed');

    console.log('User email has been successfully updated');
});

When(`I create a new user with email {string}, name {string}, gender {string} and status {string}`, async (newEmail,newName, newGender,newStatus) => {
    const createUserResponse = await axios.post('https://gorest.co.in/public/v2/users', {
        email: newEmail,
        name: newName,
        gender: newGender,
        status: newStatus
    }, {
        headers: {
            Authorization: token,
        },
    });

    console.log('Create User Response:', createUserResponse.data);

    assert.strictEqual(createUserResponse.status, 201, 'Failed to create a new user');

    userId = createUserResponse.data.id;

    console.log('New User ID:', userId);
});

Then('I verify that the user is created successfully', async () => {
    const createdUserResponse = await axios.get(`https://gorest.co.in/public/v2/users/${userId}`, {
        headers: {
            Authorization: token,
        },
    });

    console.log('Created User Response:', createdUserResponse.data);

    assert.strictEqual(createdUserResponse.status, 200, 'Failed to retrieve created user');

    console.log('User is created successfully');
});

Given('a user with previous email exists', async () => {

    const createdUserResponse = await axios.get(`https://gorest.co.in/public/v2/users/${userId}`, {
        headers: {
            Authorization: token,
        },
    });

    console.log('Created User Response:', createdUserResponse.data);

    assert.strictEqual(createdUserResponse.status, 200, 'Failed to retrieve created user');

    userIdToDelete = createdUserResponse.data.id;

    console.log('New User ID to Delete:', userIdToDelete);
});

When('I delete the user', async () => {
    const deleteUserResponse = await axios.delete(`https://gorest.co.in/public/v2/users/${userIdToDelete}`, {
        headers: {
            Authorization: token,
        },
    });

    console.log('Delete User Response:', deleteUserResponse.data);

    assert.strictEqual(deleteUserResponse.status, 204, 'Failed to delete the user');
});

Then('the user is successfully deleted', async () => {
    try {
        await axios.get(`https://gorest.co.in/public/v2/users/${userIdToDelete}`, {
            headers: {
                Authorization: token,
            },
        });
        assert.fail('User still exists after deletion');
    } catch (error) {
        assert.strictEqual(error.response.status, 404, 'Failed to verify user deletion');
        console.log('User has been successfully deleted');
    }
});