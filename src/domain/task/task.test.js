const validTaskFixture = require('./__fixtures__/validTask.json');
const largerSummaryTaskFixture = require('./__fixtures__/largerSummaryTask.json');

const Task = require('./task');

describe('TaskDomain', () => {
  it('should return data properly', () => {
    const task = new Task(validTaskFixture);
    const { valid } = task.validate(validTaskFixture);

    expect(valid).toBeTruthy();
    expect(task.toJSON().id).toEqual(validTaskFixture.id);
    expect(task.toJSON().summary).toEqual(validTaskFixture.summary);
    expect(task.toJSON().userId).toEqual(validTaskFixture.userId);
    expect(task.toJSON().createdAt).toEqual(new Date(validTaskFixture.createdAt));
    expect(task.toJSON().executedAt).toEqual(new Date(validTaskFixture.executedAt));
  });

  it('should fail with invalid email address', () => {
    const task = new Task(largerSummaryTaskFixture);
    const { valid, errors } = task.validate(largerSummaryTaskFixture);

    expect(valid).toBeFalsy();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors[0].message).toEqual('"summary" length must be less than or equal to 2500 characters long');
  });

  it('should fail when all fields are not provided or empty', () => {
    const task = new Task({});
    const { valid, errors } = task.validate({});

    expect(valid).toBeFalsy();
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors[0].message).toEqual('"userId" is required');
  });
});
