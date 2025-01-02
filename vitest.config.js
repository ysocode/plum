import {defineProject} from 'vitest/config'

export default defineProject({
    test: {
        root: './src/js/test',
        include: ['**/*.test.js']
    }
});
