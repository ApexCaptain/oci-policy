import { cdk, javascript } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { ArrowParens } from 'projen/lib/javascript';

const branches = {
  main: 'main' as const,
  develop: 'develop' as const,
};

const project = new cdk.JsiiProject({
  // ProjectOptions
  name: 'oci-policy',

  // TypescriptProjectOptions
  author: 'ApexCaptain',
  authorAddress: 'ayteneve93@gmail.com',
  eslintOptions: {
    tsconfigPath: './tsconfig.dev.json',
    dirs: ['src'],
    devdirs: [],
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
      lib: ['es2019'],
      module: 'CommonJS',
      noEmitOnError: false,
      noFallthroughCasesInSwitch: true,
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      resolveJsonModule: true,
      strict: true,
      strictNullChecks: true,
      strictPropertyInitialization: true,
      stripInternal: true,
      target: 'ES2019',
      emitDecoratorMetadata: true,
      allowSyntheticDefaultImports: true,
      outDir: './dist',
      baseUrl: './',
      skipLibCheck: true,
      forceConsistentCasingInFileNames: false,
    },
  },

  tsconfigDev: {
    include: [],
    compilerOptions: {},
  },

  // NodeProjectOptions
  gitignore: ['**/*.env'],
  deps: [],
  devDeps: [],
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
  // JsiiProjectOptions
  jsiiVersion: '~5.0.0',
  repositoryUrl: 'https://github.com/ApexCaptain/oci-policy.git',
});
project.synth();
