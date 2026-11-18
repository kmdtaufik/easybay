import { useState, useEffect } from "react";
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  Loader2,
  Search,
  Filter,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth";

const CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home Goods",
  "Art & Design",
  "Books",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Other"
];

export default function VendorProducts() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = create mode
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchProducts();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/vendor/${session.user.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("10");
    setCategory("Electronics");
    setImageUrl("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setTitle(product.title || "");
    setDescription(product.description || "");
    setPrice(product.price ? product.price.toString() : "");
    setStock(product.stock !== undefined ? product.stock.toString() : "");
    setCategory(product.category || "Electronics");
    setImageUrl(product.images?.[0] || "");
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Price must be a number greater than 0");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      setFormError("Stock must be a non-negative integer");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      stock: parsedStock,
      category,
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
    };

    try {
      const url = editingProduct
        ? `http://localhost:3000/api/products/${editingProduct._id}`
        : "http://localhost:3000/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || data.error || "Failed to save product");
        return;
      }

      closeModal();
      fetchProducts();
      setSuccessMessage(editingProduct ? "Product updated successfully" : "Product created successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Save product error:", err);
      setFormError("Network error while saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
        setSuccessMessage("Product deleted");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (stockFilter === "in_stock") return p.stock > 0;
    if (stockFilter === "low_stock") return p.stock > 0 && p.stock <= 5;
    if (stockFilter === "out_of_stock") return p.stock === 0;

    return true;
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Products
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage your product inventory, pricing, and stock levels.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {successMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Search & Stock Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Items" },
            { id: "in_stock", label: "In Stock" },
            { id: "low_stock", label: "Low Stock (≤5)" },
            { id: "out_of_stock", label: "Out of Stock" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                stockFilter === tab.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-8 w-8 text-zinc-400 mb-3" />
            <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-1">
              {searchQuery || stockFilter !== "all" ? "No matching products found" : "No products listed yet"}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
              {searchQuery || stockFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "Create your first product to begin accepting customer orders."}
            </p>
            {!searchQuery && stockFilter === "all" && (
              <Button onClick={openCreateModal} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-white">{p.title}</div>
                          <div className="text-xs text-zinc-500 line-clamp-1 max-w-xs">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-white">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {p.stock === 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Out of stock (0)
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Low stock ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In stock ({p.stock})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(p)}
                          className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p._id)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Mechanical Keyboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide product details, specifications, and materials..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Price (USD) *</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="49.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-7 pr-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Stock Units *</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Image URL (HTTPS link)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
                {imageUrl.trim() && (
                  <div className="mt-2 flex items-center gap-3 rounded-md border border-zinc-200 p-2 dark:border-zinc-800">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-10 w-10 rounded object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="text-xs text-zinc-500">Image preview valid</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
