import type { Plugin } from 'vite'
import { PACKAGE_NAME } from '../../../../general/constants'

type InjectEnvOptions = {
	env: Record<string, any>
	propNames?: string[] // env 欲導出的 key 值
	importModuleName?: string
	exportModuleName?: string
}

const PLUGIN_NAME = 'inject-env'
const FULL_PLUGIN_NAME = `vite-plugin-${PACKAGE_NAME}-${PLUGIN_NAME}`
const DEFAULT_IMPORT_MODULE_NAME = 'env-config'
const DEFAULT_EXPORT_MODULE_NAME = 'envConfig'
const CONSOLE_NAME = `[${PACKAGE_NAME}-${PLUGIN_NAME}]`

function injectEnv(options: InjectEnvOptions): any {
	if (options.importModuleName == null) options.importModuleName = DEFAULT_IMPORT_MODULE_NAME
	if (options.exportModuleName == null) options.exportModuleName = DEFAULT_EXPORT_MODULE_NAME
	if (options.propNames == null) options.propNames = ['mode', 'vite']

	const V_MODULE_NAME = `~${options.importModuleName}`
	const V_MODULE_ID = `@@${V_MODULE_NAME}`
	let result: Record<string, any> = {}

	const plugin: Plugin = {
		name: FULL_PLUGIN_NAME,
		enforce: 'pre',
		config() {
			for (let i = 0; i < options.propNames!.length; i++) {
				const propName = options.propNames![i]
				result[propName] = options.env[propName]
			}
			console.log(
				`[LOG]${CONSOLE_NAME} 已開啟環境注入功能，模塊名為 ${options.importModuleName}；export 名為 ${options.exportModuleName}；注入的環境為：\n`,
				JSON.stringify(result, null, 2),
			)
		},
		resolveId(id) {
			if (id === V_MODULE_NAME) {
				return V_MODULE_ID
			}
		},
		load(id) {
			if (id === V_MODULE_ID) {
				return `const ${options.exportModuleName} = ${JSON.stringify(result)}
          export { ${options.exportModuleName} }`
			}
		},
	}

	return plugin
}

export type { InjectEnvOptions }

export { injectEnv }
