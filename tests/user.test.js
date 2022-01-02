const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user')
const {userOneId, userOne, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Mike Salvino',
        email: 'mike@gmail.com',
        password: 'Mypass123$'
    }).expect(201)

    //Assert that user was created in database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Mike Salvino',
            email: 'mike@gmail.com'
        },
        token: user.tokens[0].token
    })
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app)
            .post('/users/login')
            .send({
                email: 'abc@abc.com',
                password: 'abcabc1'
            }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should delete user account', async () => {
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated account', async () => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('Should upload ser avatar', async () => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/me.jpg')
            .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Vivek Agrawal'
            }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).not.toBe(userOneId.name)
})

test('Should not update invalid fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                location: 'Indore'
            }).expect(400)
})