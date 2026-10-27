
import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { createArticle } from "../service/article"
import "../App.css"
import "../CreateArticle.css"

export default function CreateArticle() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState(user?.name || user?.email || "")
  const [tagsInput, setTagsInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file.")
      e.target.value = ""
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size must be less than 10MB.")
      e.target.value = ""
      return
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview)

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setErrorMsg("")
  }

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)

    setImageFile(null)
    setImagePreview(null)

    const input = document.getElementById("file-upload") as HTMLInputElement
    if (input) input.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Title and Content are required fields!")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("content", content.trim())
      formData.append(
        "author",
        author.trim() || user?.name || user?.email || "Anonymous"
      )

      if (tagsInput.trim()) {
        formData.append("tags", tagsInput.trim())
      }

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const res = await createArticle(formData)

      setSuccessMsg(res.message || "Article published successfully!")

      setTimeout(() => navigate("/"), 1200)
    } catch (err: any) {
      console.error("Save article error:", err)

      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to save article. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const tagList = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  return (
    <div className="create-article-page">
      <header className="create-topbar">
        <Link to="/" className="create-brand">
          <span className="create-brand-icon">📰</span>w
          <span>RAD Articles</span>
        </Link>

        <Link to="/" className="create-back-link">
          <span>←</span> Back to Articles
        </Link>
      </header>

      <main className="create-main">
        <section className="create-intro">
          <span className="create-eyebrow">ARTICLE STUDIO / NEW POST</span>

          <h1>
            Create something
            <span> worth reading.</span>
          </h1>

          <p>
            Put your ideas into words and share them with the RAD community.
          </p>
        </section>

        {errorMsg && (
          <div className="create-notice create-notice-error" role="alert">
            <span>⚠️</span>
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="create-notice create-notice-success" role="status">
            <span>✅</span>
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-editor">
          <div className="create-editor-top">
            <div>
              <span className="create-step">01 — COMPOSE</span>
              <h2>Article details</h2>
            </div>

            <span className="create-required-note">
              <span>*</span> Required fields
            </span>
          </div>

          <div className="create-editor-grid">
            <section className="create-fields-column">
              <div className="create-field">
                <label htmlFor="article-title">
                  Article title <span>*</span>
                </label>

                <input
                  id="article-title"
                  type="text"
                  placeholder="Give your article a clear title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <small>
                  A good title helps readers discover your story.
                </small>
              </div>

              <div className="create-field">
                <label htmlFor="article-author">Author name</label>

                <input
                  id="article-author"
                  type="text"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="create-field">
                <label htmlFor="article-tags">Tags</label>

                <input
                  id="article-tags"
                  type="text"
                  placeholder="react, nodejs, tutorial"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />

                {tagList.length > 0 && (
                  <div className="create-tags-preview">
                    {tagList.map((tag, idx) => (
                      <span key={`${tag}-${idx}`}>#{tag}</span>
                    ))}
                  </div>
                )}

                <small>Separate each tag with a comma.</small>
              </div>

              <div className="create-field create-content-field">
                <label htmlFor="article-content">
                  Article content <span>*</span>
                </label>

                <textarea
                  id="article-content"
                  rows={12}
                  placeholder="Start writing your article here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />

                <div className="create-content-footer">
                  <span>✎ Your ideas, your voice.</span>
                  <span>{content.length} characters</span>
                </div>
              </div>
            </section>

            <aside className="create-image-column">
              <div className="create-side-heading">
                <span className="create-step">02 — VISUALS</span>
                <h2>Cover image</h2>
                <p>Give your article a visual identity.</p>
              </div>

              {!imagePreview ? (
                <div className="create-upload-area">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                  />

                  <label htmlFor="file-upload">
                    <span className="create-upload-icon">↑</span>
                    <strong>Drop your image here</strong>
                    <span>or click to browse files</span>
                    <small>PNG, JPG, WEBP or GIF</small>
                    <small>Maximum file size: 10MB</small>
                  </label>
                </div>
              ) : (
                <div className="create-image-preview">
                  <img src={imagePreview} alt="Article cover preview" />

                  <div className="create-image-details">
                    <div className="create-image-file">
                      <span>▧</span>

                      <div>
                        <strong>{imageFile?.name}</strong>
                        <small>
                          {imageFile
                            ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : ""}
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="create-remove-image"
                      onClick={handleRemoveImage}
                    >
                      Remove image ×
                    </button>
                  </div>
                </div>
              )}

              <div className="create-publishing-tip">
                <span>✦</span>

                <div>
                  <strong>Make it stand out</strong>
                  <p>
                    Choose a clear cover image that reflects the topic of
                    your article.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <footer className="create-editor-footer">
            <div className="create-footer-note">
              <span className="create-status-dot" />
              Ready when you are
            </div>

            <div className="create-footer-actions">
              <button
                type="button"
                className="create-cancel-button"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-publish-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-spinner" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish article <span>↗</span>
                  </>
                )}
              </button>
            </div>
          </footer>
        </form>

        <p className="create-bottom-note">
          Crafted with care · RAD Articles
        </p>
      </main>
    </div>
  )
}
