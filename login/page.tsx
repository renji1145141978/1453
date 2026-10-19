import { Github, LogIn, Sparkles } from "lucide-react";
import { githubLogin, login, signup } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;
  return (
    <section className="auth-shell container">
      <div className="auth-copy">
        <div className="eyebrow"><Sparkles size={16} /> 欢迎来到 Iris</div>
        <h1>实践证明<br />理论。</h1>
        <p>一个账号连接你的工作台、管理权限与全部业务数据。</p>
      </div>
      <div className="auth-card">
        <div className="card-title"><LogIn /><div><h2>账户登录</h2><p>也可以在这里创建新账户</p></div></div>
        {message && <div className="notice">{message}</div>}
        <form action={githubLogin}><button className="button github" type="submit"><Github size={18} /> 使用 GitHub 继续</button></form>
        <div className="divider"><span>或者使用邮箱</span></div>
        <form className="form-stack">
          <label>显示名称<input name="name" placeholder="你的名字（注册时填写）" /></label>
          <label>邮箱<input name="email" type="email" placeholder="name@example.com" required /></label>
          <label>密码<input name="password" type="password" minLength={6} placeholder="至少 6 位" required /></label>
          <div className="form-actions">
            <button formAction={login} className="button" type="submit">登录</button>
            <button formAction={signup} className="button secondary" type="submit">注册</button>
          </div>
        </form>
      </div>
    </section>
  );
}
