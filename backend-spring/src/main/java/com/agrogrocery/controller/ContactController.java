package com.agrogrocery.controller;

import com.agrogrocery.model.Contact;
import com.agrogrocery.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping("/contact")
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        try {
            Contact savedContact = contactRepository.save(contact);
            System.out.println("Contact saved: " + savedContact.getName());
            return ResponseEntity.ok(savedContact);
        } catch (Exception e) {
            System.err.println("Error saving contact: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<Contact>> getAllContacts() {
        try {
            List<Contact> contacts = contactRepository.findAll();
            System.out.println("All Contacts Fetched: " + contacts.size());
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            System.err.println("Error fetching contacts: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/contacts/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable String id) {
        try {
            Optional<Contact> contact = contactRepository.findById(id);
            if (contact.isPresent()) {
                return ResponseEntity.ok(contact.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error fetching contact: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/contacts/{id}/status")
    public ResponseEntity<Contact> updateContactStatus(
            @PathVariable String id, 
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Optional<Contact> contactOpt = contactRepository.findById(id);
            if (contactOpt.isPresent()) {
                Contact contact = contactOpt.get();
                contact.setStatus(statusUpdate.get("status"));
                Contact updatedContact = contactRepository.save(contact);
                System.out.println("Contact status updated: " + id + " -> " + statusUpdate.get("status"));
                return ResponseEntity.ok(updatedContact);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error updating contact status: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        try {
            if (contactRepository.existsById(id)) {
                contactRepository.deleteById(id);
                System.out.println("Contact deleted: " + id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting contact: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
