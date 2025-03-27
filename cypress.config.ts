import { defineConfig } from "cypress";
import { Client } from 'pg';


export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async connectDB() {
          const client = new Client({
            user: "",
            password: "",
            host: "",
            database: "",
            ssl: false,
            port: 5431
          })
          await client.connect()
          const res = await client.query('CALL truncate_data()')
          await client.query('CALL generate_sample_data()')
          await client.end()
          return res.rows;
        }
      });
    },
  },
});
