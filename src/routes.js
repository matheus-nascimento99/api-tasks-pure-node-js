import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database, databasePath } from './database.js';
import fs from 'fs/promises';

const database = new Database;

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if(title && description) {

                database.insert('tasks', {
                    id: randomUUID(),
                    ...req.body
                });

                return res
                    .writeHead(201)
                    .end();
            }else{
                return res
                    .writeHead(400)
                    .end();
            }
            

            
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.list('tasks', search ? {
                title: search,
                description: search
            }: null);

            return res.writeHead(200).end(JSON.stringify(tasks));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: async (req, res) => {
            const { id } = req.params;

            let tasks = await fs.readFile(databasePath, 'utf-8');
            tasks = JSON.parse(tasks);
            
            const task = tasks['tasks'].findIndex(row => row.id === id);

            if(task == -1) {
                return res.writeHead(404).end(JSON.stringify({message: 'Tarefa não encontrada'}))
            }

            const { title, description } = req.body;

            if(title && description) {
                database.update('tasks', id, req.body);
            
                return res.writeHead(204).end();
            }else{
                return res.writeHead(400).end();
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: async (req, res) => {

            const { id } = req.params;

            let tasks = await fs.readFile(databasePath, 'utf-8');
            tasks = JSON.parse(tasks);
            
            const task = tasks['tasks'].findIndex(row => row.id === id);

            if(task == -1) {
                return res.writeHead(404).end(JSON.stringify({message: 'Tarefa não encontrada'}))
            }

            database.delete('tasks', id);

            return res.writeHead(204).end();

        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: async (req, res) => {
            const { id } = req.params;

            let tasks = await fs.readFile(databasePath, 'utf-8');
            tasks = JSON.parse(tasks);
            
            const task = tasks['tasks'].findIndex(row => row.id === id);

            if(task == -1) {
                return res.writeHead(404).end(JSON.stringify({message: 'Tarefa não encontrada'}))
            }
            
            database.completeTask('tasks', id);

            return res.writeHead(204).end();
        }
    }
]