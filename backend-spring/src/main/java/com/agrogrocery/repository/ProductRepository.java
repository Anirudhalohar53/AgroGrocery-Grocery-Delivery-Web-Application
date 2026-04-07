package com.agrogrocery.repository;

import com.agrogrocery.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    Product findByProductId(int productId);
    void deleteByProductId(int productId);
}
