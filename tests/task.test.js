const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/model/task')
const {userOneId, userOne, setUpDatabase, userTwoId, userTwo, taskOne, taskTwo, taskThree} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'Test Task 1'
            }).expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should get user tasks', async () => {
    const response = await request(app)
                            .get('/tasks')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send()
                            .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete other user task', async () => {
    await request(app)
            .delete('/tasks' + taskOne._id)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})