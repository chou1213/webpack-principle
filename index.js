const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

/**
 * 读取file文件的代码，获取代码中的依赖项，把代码转成es5语法的代码
 * @param {*} file 
 * @returns {file，deps，es5code}
 */
function getModuleInfo(file) {
  const body = fs.readFileSync(file, "utf-8");
  // console.log(body);

  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });
  // console.log(ast);

  const deps = {};

  // 收集file代码中import的资源
  traverse(ast, {
    ImportDeclaration({ node }) {
      // console.log(node);
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });

  // 把file代码转成es5
  const { code } = babel.transformFromAst(ast, null, {
    presets: [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": false
          // targets: {
          //   browsers: ["last 2 IE versions"],
          // },
        }]
    ],
  });

  const moduleInfo = { file, deps, code };
  return moduleInfo;
}

// const info = getModuleInfo("./src/index.js");
// console.log("info:", info);

/**
 * 生成依赖图
 * @param {*} file 
 * @returns 
 */
function parseModules(file) {
  const entry = getModuleInfo(file);
  const temp = [entry];
  const depsGraph = {};

  getDeps(temp, entry);
  // console.log(temp);

  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });

  console.log(depsGraph);
  return depsGraph;
}

function getDeps(temp, { deps }) {
  Object.keys(deps).forEach((key) => {
    const child = getModuleInfo(deps[key]);
    temp.push(child);
    getDeps(temp, child);
  });
}

// const res = parseModules('./src/index.js');
// console.log(res);


function bundle(file) {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
    function require(file) {
        function absRequire(relPath) {
            return require(graph[file].deps[relPath])
        }
        var exports = {};
        (function (require,exports,code) {
            eval(code)
        })(absRequire,exports,graph[file].code)
        return exports
    }
    require('${file}')
    })(${depsGraph})`;
}

const content = bundle('./src/index.js')

// 创建bundle文件
!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);