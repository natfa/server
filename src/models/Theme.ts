import { SubjectAttributes, SubjectOld } from './Subject';

export interface ThemeOld {
  id?: string;
  name: string;
  subject: SubjectOld;
}

import {
  Sequelize,
  Model,
  DataTypes,

  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';

import { Subject } from './Subject';
import { Question, QuestionAttributes } from './Question';

export interface ThemeAttributes {
  id?: number;
  subjectId?: number;
  name: string;
  questions?: QuestionAttributes[];
  subject?: SubjectAttributes;
};

export class Theme extends Model<ThemeAttributes> implements ThemeAttributes {
  public id!: number;
  public subjectId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSubject!: HasOneGetAssociationMixin<Subject>;
  public setSubject!: HasOneSetAssociationMixin<Subject, number>;
  public createSubject!: HasOneCreateAssociationMixin<Subject>;

  public getQuestions!: HasManyGetAssociationsMixin<Question>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public readonly subject?: Subject;
  public readonly questions?: Question[];

  public static associations: {
    subject: Association<Theme, Subject>;
    questions: Association<Theme, Question>;
  };

  public static associate = () => {
    Theme.belongsTo(Subject, {
      foreignKey: 'subjectId',
      as: 'subject',
    });

    Theme.hasMany(Question, {
      foreignKey: 'themeId',
      as: 'questions',
    });
  }
}

export const initTheme = (sequelize: Sequelize) => {
  Theme.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      subjectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      }
    },
    {
      sequelize,
      tableName: 'themes',
    }
  )
}