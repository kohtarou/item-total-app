"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-regular-svg-icons"; // faGemをインポート
import Link from "next/link";
import { supabase } from "@/utils/supabase"; // ◀ 追加
import { useAuth } from "@/app/_hooks/useAuth"; // ◀ 追加
import { useRouter } from "next/navigation"; // ◀ 追加

const Header: React.FC = () => {
  // ▼ 追加
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };
  // ▲ 追加

  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <Link href="/">
              <FontAwesomeIcon icon={faGem} className="mr-1" />{" "}
              {/* faGemに変更 */}
              アイテム管理アプリ
            </Link>
          </div>
          <div className="flex gap-x-6">
            <Link href="/table">table</Link> {/* 追加 */}
            {!isLoading &&
              (session ? (
                <button onClick={logout}>Logout</button>
              ) : (
                <Link href="/login">Login</Link>
              ))}
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
