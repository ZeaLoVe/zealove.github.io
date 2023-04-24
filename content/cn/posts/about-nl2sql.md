---
title: "关于自然语言转SQL"
date: 2023-04-24T11:32:17+08:00
featured_image: '/images/post-0015.jpg'
summary: '大模型对NL2SQL的影响'
draft: false
---

## NL2SQL简介

NL2SQL是将自然语言文本转换成结构化查询语言SQL的过程，属于自然语言处理-语义分析的子任务。

NL2SQL的流程步骤可能包括以下几个方面：
- 问题理解：分析问题的意图、结构、逻辑、关键词等，提取出问题中的实体、属性、条件、操作等信息。
- 表格理解：分析表格的结构、格式、领域等，提取出表格中的列名、行名、值、类型等信息。
- 模式映射：将问题中的信息和表格中的信息进行匹配，确定查询的目标列、条件列、条件值等。

SQL生成：根据模式映射的结果，生成合法且正确的SQL语句，可能涉及到多表连接、子查询、聚合函数等操作。

NL2SQL的存在的难点可能包括以下几个方面：
- 问题复杂性：问题可能涉及到多个步骤、逻辑、比较、聚合等操作，需要深入理解问题的含义和需求。
- 表格多样性：表格可能有不同的结构、格式、领域等特征，需要泛化到未见过的表格上。
- 模式映射：问题中的信息和表格中的信息可能有不同的表达方式、缩写、别名等，需要进行有效的对齐和消歧。
- SQL生成：生成的SQL语句需要符合语法规则且能正确执行，需要考虑不同数据库系统的兼容性和效率。

## 大模型对NL2SQL的影响

Spider榜单目前的第四名是基于codex实现的（得分78.2），第一名是基于GPT-4实现的（得分85.3分），从分数上看，GPT4实现的得分与第二名79.9分差距十分明显，codex实现相对第二名落后并不大。

由此可见大模型在NL2SQL里具备技术优势，其泛化能力和迁移能力结合预训练数据训练通用的领域知识及数据库知识，使其可以到达当前最高的水准。

在实际使用过程中，交互性的对话能力，可以通过用户上下文的反馈学习，取得更符合目标的结果。

## NL2SQL应用场景

大模型并不是万能的，其具备以下问题：
- 可复现性，每次生成的结果可能不稳定
- 可解释性，难以理解如何得到的结果，是否存在歧义及错误
- 可靠性, 其可能并不理解用户的真实需求，或者SQL的语法规则，只是单纯在模仿

另一个局限性来自自然语言本身，自然语言无法代替SQL的严格性和精确性语言本身存在表达不准确或者认知偏差。

因此单纯依靠自然语言直接得到SQL并执行的方案存在限制，但是可以作为SQL的补充，对其定位为辅助场景，帮助没有SQL编写经验的业务人员可以灵活的进行个性化的取数需求。考虑到这个领域已经有大量的低代码工具，如何和这些工具结合是一个思考方向。

可以参考开源项目 sqltranslate（基于模型code-davinci-002）及 工具服务sqlkiller（实现未知）。

## 简单测试用例设计

### 要素考虑

1. 表结构信息
2. UDF用户定义函数及其他数据库特有的系统函数
3. 数据库方言
4. 模型token问题


### 用例

### 模型选择

gpt-35-turbo、text-davinci-003、code-davinci-002、GPT-4 从目前看都具备不错的效果，但这些模型的使用成本是不同的，而且模型本身有专注于不同的任务。

其中gpt-35-turbo、GPT-4主要是对话式的，对于生成SQL的场景不大需要其对话能力和处理通用问题的能力。

code-davinci-002(codex) 主要强项在代码生成，SQL对于代码来说相对简单，也是比较贵的模型，1000token高达0.1 刀的成本并不适合作为SQL生成的方案。

GPT-4同样问题也是贵，综合看来，选择text-davinci-003或者干脆考虑性价比最高的gpt-35-turbo。

### 提示语工程

提示语工程是一种利用自然语言生成技术，为用户提供合适的提示语，帮助用户更好地表达查询意图的方法。提示语工程对NL2SQL的意义在于，可以提高用户输入自然语言问题的质量和准确性，从而提高SQL生成模型的性能和鲁棒性。提示语工程也可以帮助用户更好地理解数据库的结构和内容，避免一些无效或错误的查询。

不同的模型对于提示语的要求是不同的，如codex要求将需求写成注释的形式，如下所示：

```
### PostgreSQL SQL
# {table_ddl_1}
# {table_ddl_2}
### {prompt}

SELECT 
```

对于对话类的模型如gpt-35-turbo，需要类似角色扮演的提示语：
1. 系统提示语
2. 用户提示语

例如：

```
system_prompt = f'You are a PostgreSQL database with the following table structure. \
Your answer can only be SQL. If the table structures cannot fulfill your answer, \
please respond with "The database does not contain the table data you are looking for : ) "\n{table_ddl}'

user_prompt = f'Please answer me briefly with SQL code, just sql content: {prompt}'
```

### 基于某开源项目进行效果实测

## 后续工作

如何评估方案的效果、评估标准及工具设计。（基于开源的NL2SQL基准测试集，设计效果评测方法及脚本工具。如Spider、SParC等）

## 参考资料

- [Spider](https://yale-lily.github.io/spider)
- [wikitablequestions](https://nlp.stanford.edu/blog/wikitablequestions-a-complex-real-world-question-understanding-dataset/)
- [SParC](https://yale-lily.github.io/sparc)
- [sqltranslate](https://www.sqltranslate.app/)
- [sqlkiller](https://www.sqlkiller.com/)
- [Azure OpenAI models](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/models)
- [Azure OpenAI codex usage](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/work-with-code)
