const jsonData = './db.json';

import { relative, resolve, join } from 'path';
import * as paths from './paths';
import * as colors from 'colors';
import { extender as messages } from './messages';
import * as glob from 'globby';

import Finder = require('fs-finder');
import fsExtra = require('fs-extra');

import globParent = require('glob-parent');
import jsonConcat = require('json-concat');
import requireGlob = require('require-glob');

export interface JsonExtenderOptions {
    generatedPath: string;
    filePath: string;
    staticFiles: string[];
}

const reducer = (options, tree, fileObj) => {
    if (!fileObj || !fileObj.path || !('exports' in fileObj)) {
        return tree;
    }

    const keys = [].concat(options.keygen(fileObj));

    if (!keys.length) {
        return tree;
    }

    const firstKey = keys[0];

    tree[firstKey] = fileObj.exports;

    return tree;
};

/**
 * permit to use several json files and generators
 * @see https://github.com/maty21/json-server-extension
 * Unlike the json-server-extension, this one use glob-patterns to determine where are located the generators and static json files,
 * and only needs you to call register().
 */
export class JsonExtender {

    private generatedPath;
    private filePath;
    private staticFiles: string[];
    private filesToGenerate;
    private startingPoint;
    private promise;
    private resolve;

    /**
     * Configure the JsonExtender
     * @param options Object :
     *  * generatedPath string path to the folder where you want to generate the json staticFiles
     *  * filePath string path to the "base" db dbFile
     *  * staticFiles string[] glob patterns (see node-glob) to the static files 
     *      (for now, we only support .json files, but you needs to specify the extension anyway)
     */
    constructor(options: JsonExtenderOptions) {
        this.generatedPath = options.generatedPath;
        this.filePath = options.filePath;
        this.staticFiles = options.staticFiles;

        this.filesToGenerate = [];
        this.startingPoint = null;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    }

    /**
     * register the generators and generate the resulting json files
     * @see https://www.npmjs.com/package/require-glob
     * @param ...patterns string[] node-glob patterns corresponding to the generators to register
     */
    register(...patterns: string[]): Promise<void> {
        return requireGlob(patterns, { reducer }).then((modules) => {
            this.filesToGenerate.push(...Object.keys(modules).map((key) => {
                return modules[key]['default'];
            }));
            return this.generate();
        });
    }

    private generate() {
        return new Promise((resolve, reject) => {
            let prevFunc = this.extend.bind(this);
            this.filesToGenerate.reverse().map((generator) => {
                this.startingPoint = prevFunc = generator(prevFunc);
            });
            this.startingPoint(this.createJson.bind(this));
            this.promise.then((data) => resolve(data)).catch((e) => reject(e));
        });
    }

    private createJson(object) {
        const absolutePath = `${this.generatedPath}/${object.path}`;
        fsExtra.outputJSONSync(absolutePath, object.data, null, (err) => {
            console.error(err); // => null
        });
    }


    private extend(arr) {

        const generatedFiles = Finder.from(`${this.generatedPath}`).findFiles('*.json');
        const options = {
            cwd: paths.srcFolder,
            base: resolve(paths.srcFolder, globParent(this.staticFiles[0])),
        };
        const staticFiles = glob.sync(this.staticFiles, options).map((file) => join(paths.srcFolder, file));
        const files = [
            ...staticFiles,
            ...generatedFiles,
        ];
        jsonConcat({
            src: [
                jsonData,
                ...files,
            ],
            dest: this.filePath,
        }, (json) => {
            console.log(messages.success);
            console.log(messages.staticTitle);
            let counter = 1;
            staticFiles.map((file) => {
                console.log(colors.green(` ${counter}) ${relative(paths.staticFiles, file)}`));
                counter++;
            });
            console.log(messages.generatedTitle);

            counter = 1;
            generatedFiles.map((file) => {
                console.log(colors.green(` ${counter}) ${relative(paths.generatedFolder, file)}`));
                counter++;
            });
            console.log(messages.savedTo(this.filePath));
            this.resolve({ files: `${files}`, filePath: `${this.filePath}` });
        });

    }

}
