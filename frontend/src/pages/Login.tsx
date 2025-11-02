import { GalleryVerticalEnd, LineChart, PiggyBank, Shield, TrendingUp, Wallet } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary-foreground" />
                        </div>
                        Budget Tracker
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm onSuccess={() => console.log("Signed UP")} />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <div className="hidden min-h-svh lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-lg space-y-12">
                        {/* Hero Image Placeholder */}
                        <div className="aspect-square w-full max-w-md mx-auto bg-emerald-800/30 rounded-2xl backdrop-blur-sm border border-emerald-700/50 flex items-center justify-center overflow-hidden shadow-2xl">
                            <div className="text-center space-y-4 p-8">
                                <div className="w-24 h-24 mx-auto bg-emerald-600/50 rounded-full flex items-center justify-center">
                                    <LineChart className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold">Financial Visualization</h3>
                                <p className="text-emerald-200 text-sm">
                                    Track your income, expenses, and savings with beautiful charts and insights
                                </p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Take Control of Your Money</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
                                        <PiggyBank className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Smart Budget Planning</h3>
                                        <p className="text-sm text-emerald-200">Set budgets and track spending across categories</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                                        <p className="text-sm text-emerald-200">Visualize your financial data with interactive charts</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Secure & Private</h3>
                                        <p className="text-sm text-emerald-200">Your financial data is encrypted and secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
