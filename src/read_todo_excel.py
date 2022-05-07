#%%
import pandas as pd
df = pd.read_excel("../data/tomatodo_history_935.xlsx",)
df
# %%

col_names = ["专注时间","待办名称","专注时长（分钟）","心得","状态","完成度"]
df_new = df.iloc[8:,1:]
df_new.columns = col_names
df_new.index = range(len(df_new))
df_new

# %%
# 心得最好包含尽可能多的信息，心得可以是一个json格式，直接读
# 类型等填表，或者在起名时就有一些自动化了
score_map = {"整理":1, "矩阵模拟开发":3, "卫生":1, "课外阅读":1, "刷手机": -2}
(df_new["专注时长（分钟）"] / 60 * df_new["待办名称"].apply(lambda x: score_map[x])).sum()
# %%
# 5月7日 12.416分