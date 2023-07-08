import { JsonFile, cdk, javascript } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { ArrowParens } from 'projen/lib/javascript';
import * as Aux from './project';
const branches = {
  main: 'main' as const,
  develop: 'develop' as const,
};
const projectName = 'oci-policy';

const project = new cdk.JsiiProject({
  // ProjectOptions
  name: projectName,

  // TypescriptProjectOptions
  eslintOptions: {
    tsconfigPath: './tsconfig.dev.json',
    dirs: ['src'],
    devdirs: ['project'],
    ignorePatterns: ['/**/node_modules'],

    prettier: true,
  },
  projenrcTs: true,
  tsconfig: {
    compilerOptions: {
      alwaysStrict: true,
      declaration: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      inlineSourceMap: true,
      inlineSources: true,
      sourceMap: true,
      lib: ['es2019'],
      module: 'CommonJS',
      noEmitOnError: false,
      noFallthroughCasesInSwitch: true,
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      resolveJsonModule: true,
      strict: true,
      strictNullChecks: true,
      strictPropertyInitialization: true,
      stripInternal: true,
      target: 'ES2019',
      emitDecoratorMetadata: true,
      allowSyntheticDefaultImports: true,
      outDir: './dist',
      baseUrl: '.',
      skipLibCheck: true,
      forceConsistentCasingInFileNames: false,
    },
  },

  tsconfigDev: {
    include: ['project/**/*.ts'],
    compilerOptions: {},
  },
  // GitHubProjectOptions
  githubOptions: {
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: ['test', 'feat', 'fix', 'chore'],
      },
    },
  },
  projenCredentials: GithubCredentials.fromPersonalAccessToken({
    secret: 'GITHUB_TOKEN',
  }),

  // NodeProjectOptions
  gitignore: ['**/*.env'],
  deps: [],
  devDeps: ['flat', 'flatley', '@types/flat', 'deepmerge'],
  defaultReleaseBranch: branches.main,
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
      branches: [branches.develop],
    },
    pullRequestTitle: 'Upgrade Node Deps',
  },
  prettier: true,
  prettierOptions: {
    settings: {
      semi: true,
      arrowParens: ArrowParens.AVOID,
      endOfLine: javascript.EndOfLine.AUTO,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: javascript.TrailingComma.ALL,
    },
  },
  release: true,
  releaseToNpm: true,
  // ReleaseProjectOptions
  minMajorVersion: 1,
  // JsiiProjectOptions
  publishToPypi: {
    distName: projectName,
    module: projectName,
  },
  repositoryUrl: 'https://github.com/ApexCaptain/oci-policy.git',
  author: 'ApexCaptain',
  authorAddress: 'ayteneve93@gmail.com',

  jsiiVersion: '~5.0.0',
});

void (async () => {
  // Aux
  const depsAux = new Aux.DependencyAuxiliary(project, {
    jsonDirPath: 'data/deps',
    fileNamePrefix: project.name,
  });
  await depsAux.process();

  const dicAux = new Aux.DictionaryAuxiliary(project, {
    jsonDirPath: 'data/dic',
    fileNamePrefixes: [project.name, 'projen'],
  });
  await dicAux.process();

  const vscodeSettingsAux = new Aux.VsCodeSettingsAuxiliary(project, {
    settings: {
      editor: {
        defaultFormatter: 'esbenp.prettier-vscode',
      },
      workbench: {
        colorTheme: 'Tomorrow Night Blue',
      },
    },
  });
  await vscodeSettingsAux.process();

  // Synthesize
  project.synth();
})();
