#%%
import pandas as pd
df = pd.read_excel("../data/tomatodo_history_765.xlsx",)
df
# %%

col_names = ["专注时间","待办名称","专注时长（分钟）","心得","状态","完成度"]
df_new = df.iloc[6:,1:]
df_new.columns = col_names
df_new.index = range(len(df_new))
df_new

# %%
# 心得最好包含尽可能多的信息，心得可以是一个json格式，直接读
# 类型等填表，或者在起名时就有一些自动化了
score_map = {"整理":1, "矩阵模拟开发":3, "卫生":1, "课外阅读":1, "刷手机": -2, "锻炼":1, "开发":2, "调研":1, "沟通":2}
(df_new["专注时长（分钟）"] / 60 * df_new["待办名称"].apply(lambda x: score_map[x])).sum()
# %%
# 5月7日 12.416分
# 5月8日 16.717分
#%%
# 番茄挑战
df_fq = pd.read_csv("../data/番茄挑战v1-报告.csv")
df_fq
# %%
df_fq["time"] = pd.to_datetime(df_fq["添加时间"])
# %%
df_new
# %%
df_new["start"] = df_new["专注时间"].apply(lambda x: pd.to_datetime(x.split("至")[0]))
# %%
df_new["end"] = df_new["专注时间"].apply(lambda x: pd.to_datetime(x.split("至")[1]))

# %%
idx=0
def get_one_score(df_new, df_fq, idx):
    # print((df_new["start"] - df_fq["time"][idx]).apply(lambda x:x.days* 60 *60 *24+ x.seconds))
    df_select = df_new[(df_new["start"] - df_fq["time"][idx]).apply(lambda x: x.days* 60 *60 *24+ x.seconds < 240 and x.days* 60 *60 *24+ x.seconds>-120)]
    expect_time = df_fq.loc[idx,"挑战时间（分钟）"]

    cost_time = list(df_select["专注时长（分钟）"])[0]
    type_score = score_map[list(df_select["待办名称"])[0]]
    def score_multi_type(str_):
        base = 1
        if type(str_) != str:
            return base
        if "ddl当日" in str_:
            base *= 1.2
        if "赚钱" in str_:
            base *= 1.2
        if "当日突发" in str_:
            base *= 0.8
        if "人情" in str_:
            base *= 1.2
        if "不紧急但重要" in str_:
            base *= 1.4
        return base
    score_factor = score_multi_type(df_fq.loc[idx,"挑战类别"])
    score_factor
    def get_time_factor(expect, real):
        if expect >= real:
            return 1
        elif expect >= real * 1.2:
            return 0.5
        elif expect >= real * 1.5:
            return 0.2
        else:
            return -1
    time_factor = get_time_factor(expect_time,cost_time)
    return expect_time > cost_time, expect_time /60 * type_score* score_factor * time_factor
get_one_score(df_new, df_fq, idx)
# %%
fq_score = 0
fq_level = 0
for idx in df_fq.index:
    flag, score_tmp = get_one_score(df_new, df_fq, idx)
    fq_level += (flag - 0.5) * 2
    fq_score += score_tmp
fq_score
# %%
fq_level
# %%
get_one_score(df_new, df_fq, idx)
# %%
# 5月8日 -3级 16.717-4.12=12.597