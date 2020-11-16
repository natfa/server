import { Sequelize } from 'sequelize';

import { Subject, initSubject } from './Subject';
import { Theme, initTheme } from './Theme';
import { Question, initQuestion } from './Question';
import { Answer, initAnswer } from './Answer';
import { Exam, initExam } from './Exam';
import { User, initUser } from './User';
import { Role, initRole } from './Role';
import { Specialty, initSpecialty } from './Specialty';
import { Student, initStudent } from './Student';
import { Teacher, initTeacher } from './Teacher';
import { Solution, initSolution } from './Solution';
import { SolutionAnswer, initSolutionAnswer } from './SolutionAnswer';

import config from '../config/default';

const { db } = config;

//const sequelize = new Sequelize(`mysql://${db.user}:${db.password}@${db.host}/${db.database}`);
const sequelize = new Sequelize('sqlite::memory:');

// init models
initSubject(sequelize);
initTheme(sequelize);
initQuestion(sequelize);
initAnswer(sequelize);
initExam(sequelize);
initUser(sequelize);
initRole(sequelize);
initSpecialty(sequelize);
initStudent(sequelize);
initTeacher(sequelize);
initSolution(sequelize);
initSolutionAnswer(sequelize);

// create associations
Subject.associate();
Theme.associate();
Question.associate();
Answer.assocate();
Exam.associate();
User.associate();
Role.associate();
Student.associate();
Specialty.associate();
Solution.associate();
SolutionAnswer.associate();

export {
    sequelize,
    Subject,
    Theme,
    Question,
    Answer,
    Exam,
    User,
    Role,
    Specialty,
    Student,
    Teacher,
    Solution,
    SolutionAnswer,
}