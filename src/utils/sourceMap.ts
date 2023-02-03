import sourceMap from 'source-map-js'

// 找到以.js结尾的fileName
function matchStr(str: string) {
  if (str.endsWith('.js'))
    return str.slice(Math.max(0, str.lastIndexOf('/') + 1))
}

// 将所有的空格转化为实体字符
function repalceAll(str: string) {
  return str.replace(new RegExp(' ', 'gm'), '&nbsp;')
}

export const findCodeBySourceMap = async (
  {
    sourceData,
    line,
    column,
  }: {
    sourceData: string
    line: string
    column?: string
  },
  callback: (val: string) => void
) => {
  if (!sourceData) return
  const { sourcesContent, sources } = JSON.parse(sourceData)
  const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(sourceData))
  const result = consumer.originalPositionFor({
    line: Number(line),
    column: Number(column),
  })
  console.log('result', result)
  const code = sourcesContent![sources.indexOf(result.source)]
  if (!code) return
  const codeList = code.split('\n')
  const row = result.line,
    len = codeList.length - 1
  const start = row - 5 >= 0 ? row - 5 : 0, // 将报错代码显示在中间位置
    end = start + 9 >= len ? len : start + 9 // 最多展示10行
  const newLines = []
  let j = 0
  for (let i = start; i <= end; i++) {
    j++
    newLines.push(
      `<div class="code-line ${i + 1 == row ? 'heightlight' : ''}" title="${
        i + 1 == row ? result.source : ''
      }">${j}. ${repalceAll(codeList[i])}</div>`
    )
  }
  const innerHTML = `<div class="errdetail"><div class="errheader">${
    result.source
  } at line ${result.column}:${row}</div><div class="errdetail">${newLines.join(
    ''
  )}</div></div>`
  callback(innerHTML)
}
