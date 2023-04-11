import fs from 'fs/promises';

export const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push({
                ...data,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: null
            });
        }else{
            this.#database[table] = [{
                ...data,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: null
            }];
        }
        this.#persist();

        return data;
    }

    list(table, search) {

        let list = this.#database[table] ?? [];

        if(search) {
            list = list.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase());
                })
            })
        }

        return list;
    }

    update(table, id, data) {
        const task = this.#database[table].findIndex(row => {
            return row.id === id;
        });

        if(task != -1) {
            this.#database[table][task] = {
                id,
                ...data,
                completed_at: null,
                created_at: this.#database[table][task].created_at,
                updated_at: new Date().toISOString(),
            };

            this.#persist();
        }
        
    }

    delete(table, id) {
        const task = this.#database[table].findIndex(row => {
            return row.id === id;
        });

        if(task != -1) {
            this.#database[table].splice(task, 1);
            this.#persist();
        }
    }

    completeTask(table, id) {
        const task = this.#database[table].findIndex(row => {
            return row.id === id;
        });

        if(task != -1) {
            
            const completedAt = this.#database[table][task].completed_at === null ? new Date().toISOString() : null;

            this.#database[table][task].completed_at = completedAt;

            this.#persist();
        }
    }

}