package com.example.financeTracker.DTO;

public class CategoryDTO {

    private Long categoryId;
    private String categoryName;
    private String type;
    private String categoryImage;

    public CategoryDTO(Long categoryId, String categoryName, String type, String categoryImage) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.type = type;
        this.categoryImage = categoryImage;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategoryImage() {
        return categoryImage;
    }

    public void setCategoryImage(String categoryImage) {
        this.categoryImage = categoryImage;
    }
}
