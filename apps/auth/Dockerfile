# use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY . /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY . /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build --filter=@bunstack/auth...

# copy production dependencies and source code into final image
FROM nginx:stable-alpine AS release
COPY --from=prerelease /usr/src/app/apps/auth/dist /usr/share/nginx/html
COPY --from=prerelease /usr/src/app/apps/auth/nginx.conf /etc/nginx/conf.d/default.conf

# run the app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
