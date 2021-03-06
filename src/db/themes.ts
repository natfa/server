import { query } from './index';
import { OkPacket } from './OkPacket';

import { SubjectsRowDataPacket, buildSubject } from './subjects';

import { Theme } from '../models/Theme';

export interface ThemesRowDataPacket {
  id: number;
  name: string;
  subjectid: number;
}

interface FullThemesRowDataPacket {
  themes: ThemesRowDataPacket;
  subjects: SubjectsRowDataPacket;
}

export function buildTheme(dataPacket: FullThemesRowDataPacket): Theme {
  const subject = buildSubject(dataPacket.subjects);

  const theme: Theme = {
    id: String(dataPacket.themes.id),
    name: dataPacket.themes.name,
    subject,
  };

  return theme;
}

function saveOne(theme: Theme): Promise<Theme> {
  return new Promise<Theme>((resolve, reject) => {
    query({
      sql: `insert into themes
      (name, subjectid) values
      (?, ?)`,
      values: [theme.name, theme.subject.id],
    }).then((result: OkPacket) => {
      resolve({
        id: String(result.insertId),
        name: theme.name,
        subject: theme.subject,
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneById(id: string): Promise<Theme|null> {
  return new Promise<Theme|null>((resolve, reject) => {
    query({
      sql: `select * from themes
      inner join subjects
        on themes.subjectid = subjects.id
      where themes.id = ?`,
      values: [id],
      nestTables: true,
    }).then((results: FullThemesRowDataPacket[]) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const theme: Theme = buildTheme(results[0]);
      resolve(theme);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getAll(): Promise<Array<Theme>> {
  return new Promise<Array<Theme>>((resolve, reject) => {
    query({
      sql: `select * from themes
      inner join subjects
        on themes.subjectid = subjects.id`,
      nestTables: true,
    }).then((results: FullThemesRowDataPacket[]) => {
      const themes: Theme[] = results.map((result) => buildTheme(result));
      resolve(themes);
    }).catch((err) => {
      reject(err);
    });
  });
}

function deleteOneById(id: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: `delete from themes
      where themes.id = ?`,
      values: [id],
    }).then((result: OkPacket) => {
      if (result.affectedRows === 1) {
        resolve(true);
      } else if (result.affectedRows === 0) {
        resolve(false);
      } else {
        throw new Error('Something is wrong with the database consistency');
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function getManyBySubjectid(id: string): Promise<Array<Theme>> {
  return new Promise<Array<Theme>>((resolve, reject) => {
    query({
      sql: `select * from themes
      inner join subjects
        on themes.subjectid = subjects.id
      where themes.subjectid = ?`,
      values: [id],
      nestTables: true,
    }).then((results: FullThemesRowDataPacket[]) => {
      const themes = results.map((result) => buildTheme(result));
      resolve(themes);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOneByName(name: string): Promise<Theme|null> {
  return new Promise<Theme|null>((resolve, reject) => {
    query({
      sql: `select * from themes
      inner join subjects
        on themes.subjectid = subjects.id
      where themes.name = ?`,
      values: [name],
      nestTables: true,
    }).then((results: FullThemesRowDataPacket[]) => {
      if (results.length === 0) {
        resolve(null);
        return;
      }

      const theme: Theme = buildTheme(results[0]);
      resolve(theme);
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
  getOneById,
  getAll,
  deleteOneById,
  getManyBySubjectid,
  getOneByName,
};
