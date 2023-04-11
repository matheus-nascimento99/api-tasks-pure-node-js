import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';

const database = new Database;

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            database.insert('tasks', {
                id: randomUUID(),
                ...req.body
            });

            return res
                    .writeHead(201)
                    .end();
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { query } = req.query;
            const tasks = database.list('tasks', query ? {
                title: query,
                description: query
            }: null);

            return res.writeHead(200).end(tasks);
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            
            database.update('tasks', id, req.body);
            
            return res.writeHead(204);
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params;

            database.delete('tasks', id);

            return res.writeHead(204);

        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;

            database.completeTask('tasks', id);

            return res.writeHead(204);
        }
    }
]