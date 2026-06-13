# Agent Encoding Guide

本项目源码、Demo 文案和样式文件中的中文内容均按 UTF-8 处理。

## 读取规则

- 读取文件时默认使用 UTF-8，不要按 GBK、ANSI 或系统默认编码解释。
- 如果终端显示中文为乱码，优先认为是终端输出编码问题，不要直接修改文件中的中文。
- 在 PowerShell 中读取中文文件时使用：

```powershell
Get-Content -Encoding utf8 <file>
```

- 如需调整当前终端输出编码，可使用：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```

## 写入规则

- 写入或修改文件时使用 UTF-8，无 BOM。
- 不要把已经显示为乱码的中文内容再次保存回文件。
- 修改包含中文的文件前，先确认读取方式是 UTF-8。
- 保留已有中文字符和标点，除非任务明确要求改文案。

## 判断原则

如果看到类似 `瀵艰埅鑿滃崟`、`閫変腑` 这类文本，不要立刻判定源码需要被改写。先用 UTF-8 重新读取文件，确认是显示层编码问题还是文件内容本身已经被错误编码。
