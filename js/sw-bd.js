const db = new PouchDB('deposits');
const dbExpenses = new PouchDB('expenses');

const guardarNota = (nota) => {
    nota._id = new Date().toISOString();
    return db.put(nota).then(() => {
        self.registration.sync.register('nueva-nota');
        const newResp = { ok: true, offline: true };
        return new Response(JSON.stringify(newResp));
    });
};

const guardarExpense = (expense) => {
    expense._id = new Date().toISOString();
    return dbExpenses.put(expense).then(() => {
        self.registration.sync.register('nueva-expense');
        const newResp = { ok: true, offline: true };
        return new Response(JSON.stringify(newResp));
    });
};

const postearNotas = () => {
    const notasPost = [];
    return db.allDocs({ include_docs: true }).then(docs => {
        console.log('se ahn encontrado Depositos en index DB');
        docs.rows.forEach(row => {
            const doc = row.doc;
            const data = {
                title: doc.title,
                description: doc.description,
                date: doc.date,
                amount: doc.amount,
                type: doc.type,
                idUser: doc.idUser
            };

            const fetchProm = fetch('https://aplicacion-sgp.vercel.app/api/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)


            }).then(resp =>
                {
                    console.log ('Conexion recuperada enviando depositos a servidor... ', resp.json())
                    //eliminar las notas de index db
                    return db.remove(doc);
                });
            notasPost.push(fetchProm);
        });
        return Promise.all(notasPost);
    });
};

const postearExpenses = () => {
    const expensesPost = [];
    return dbExpenses.allDocs({ include_docs: true }).then(docs => {
        console.log('se ahn encontrado gatos en index DB');

        docs.rows.forEach(row => {
            const doc = row.doc;
            const data = {
                title: doc.title,
                description: doc.description,
                date: doc.date,
                amount: doc.amount,
                type: doc.type,
                idUser: doc.idUser
            };

            const fetchProm = fetch('https://aplicacion-sgp.vercel.app/api/expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(resp =>
                {
                    console.log ('Conexion recuperada enviando Gastos al servidor... ', resp.json())
                    //eliminar las notas de index db
                    return dbExpenses.remove(doc);
                });

            expensesPost.push(fetchProm);
        });
        return Promise.all(expensesPost);
    });
};
