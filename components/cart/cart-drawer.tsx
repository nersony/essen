"use client"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"

interface CartDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Your Cart
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-12">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-6">Your cart is empty</p>
                        <SheetClose asChild>
                            <Button asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-auto py-4">
                            <ul className="space-y-4">
                                {items.map((item) => (
                                    <li key={item.id} className="flex border-b pb-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div className="flex justify-between text-base font-medium">
                                                <h3>
                                                    <Link href={`/products/${item.slug}`} className="hover:text-primary">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                                        className="h-8 w-12 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <SheetFooter className="border-t pt-6 flex-col items-stretch gap-4">
                            <div className="flex flex-col justify-center">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Subtotal</span>
                                    <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 mt-2">
                                <SheetClose asChild>
                                    <Button asChild size="lg" className="w-full py-6">
                                        <Link href="/checkout">Proceed to Checkout</Link>
                                    </Button>
                                </SheetClose>
                                <Button variant="outline" size="lg" onClick={clearCart} className="w-full border-gray-300">
                                    Clear Cart
                                </Button>
                            </div>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
