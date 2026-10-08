# Jenesei ID - authorization service

[![wakatime](https://wakatime.com/badge/user/7f9aaba0-b5dd-4e0d-9f70-cd2b6ba680d1/project/018cb0c8-9aa9-4f16-ae33-d4c1cb2629d5.svg)](https://wakatime.com/badge/user/7f9aaba0-b5dd-4e0d-9f70-cd2b6ba680d1/project/018cb0c8-9aa9-4f16-ae33-d4c1cb2629d5)

### Usage ⌨️

1. install dependencies with:  
   `npm i`

2. run in dev mode (watch changes in the files and refresh your browser automatically):  
   `npm run start`

3. would like to publish the project as a website? Then make a distribution build by generating static files:  
   `npm run build`

4. Bundle Visualizer:
   `npx vite-bundle-visualizer`
   `npx vite-bundle-visualizer -t sunburst`
   `npx vite-bundle-visualizer -t network`

5. run the same checks as the release pipeline:
   `npm run check`

### Environments

There is one branch and one version. Builds are produced per environment by the
deployment platform, not by this repository. Each environment sets its own
`VITE_*` values when it builds, so the same commit yields a different bundle per
environment.

The build reads the environment from `VITE_NODE_ENV`:

| Value | Meaning | Robots meta | Devtools |
| ----- | ------- | ----------- | -------- |
| `prod` | Production | `noindex, nofollow` | off |
| `dev`  | Development | `index, nofollow` | off |
| `test` | Staging | `noindex, nofollow` | on |

Any other value fails the build on purpose. There is no `--mode` flag on the build
script, so the mode cannot drift away from `VITE_NODE_ENV`.

Required keys are listed in `.env.template`. Real values are not kept in the
repository. For local work copy the template to `.env.local`.

`VITE_APP_VERSION` is written by the release pipeline. Do not set it by hand.

### Releases

The pipeline does not build. It runs `check`, bumps the version in `package.json`,
commits, tags, and publishes a GitHub Release. Run it from the Actions tab with the
`deploy-node` workflow.

### Files

| Path            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| /src/           | The root directory containing the application code.                                                 |
| /src/api        | The directory with TanStack.                                                                    |
| /src/assets     | Contains static files such as icons, pictures and logos.                     |
| /src/components | Here are the components that are available globally.                          |
| /src/core       | The directory with special data.                                                           |
| /src/functions  | The directory with functions.                                                                 |
| /src/hooks/     | The directory with hooks.                                                                    |
| /src/layouts    | The directory with wrappers for special pages.                                              |
| /src/pages      | The directory with the project page files.                                                   |
| /src/providers  | The directory with data providers.                                                       |
| /src/styles     | The directory for global project styles.                                               |
| /public/        | The directory containing the HTML file of the project, the manifest file of the project, as well as all kinds of icons. |

test
