---
template: post
slug: "/posts/sql-vs-nosql-comparision"
draft: false
socialImage: "./media/sql-nosql.png"
title: SQL and NoSQL comparison (EN)
date: 2021-03-21T15:02:50.837Z
description: This will show differents between SQL and NoSQL and when to use them.
category: Database
tags:
  - Database
  - SQL
  - NoSQL
---

# Steal from:

https://medium.com/swlh/sql-vs-nosql-databases-are-they-really-that-different-f49ab6e4bb0a

https://www.geeksforgeeks.org/transaction-isolation-levels-dbms

https://www.quora.com/What-are-the-problems-that-a-NoSQL-database-tries-to-solve

https://www.thorntech.com/sql-vs-nosql/

https://web.archive.org/web/20160510045647/http://djondb.com/blog/nosql-masterdetail-sample/

https://stackoverflow.com/questions/13397979/sql-versus-nosql-speed

# Data Models

Data Models are an abstract concept. They provide a logical structure to how data is stored on a database.

There are a number of Data Models, but we will mainly be focusing on two kinds of Data Models in this article — Relational (SQL) and Document Data Models (NoSQL).

In the Relational Data Model, data is stored as a collection of entities (rows). There exist well-defined relations between entities in different tables. These relations serve as a link between different tables and allow us to access data in different ways while maintaining the underlying structure of the database.

In the Document Data Model, data is simply stored in the form of key-value pairs. The key is generally in the form of a string and is used to uniquely identify an entity or data object being stored. The data itself, while it can be in any format, is generally stored in the form of JSON or XML.

So, **there are no well-defined attributes or relations for an entity in the Document Data Model**.

# What is a Database?

A database is a structured collection of data, typically stored on a single machine, or a cluster. Generally, all databases are expected to provide one key function — the ability to store and retrieve data.

### The problem with the term “NoSQL”

Referring to databases not following the Relational Model as NoSQL is a bit misleading. Many modern NoSQL Databases come with an in-built SQL-like querying functionality.

The term NoSQL was intended as a Twitter hashtag used for a meetup on open source, distributed, non-relational databases in 2009. However, the term gained popularity in the developer community, and people started referring to non-relational databases as NoSQL. But it's not, the term since then has been redefined as “Not Only SQL”.

# Comparing SQL and NoSQL Databases

For the sake of comparison, we will be looking at five features which are frequently discussed when talking about SQL vs NoSQL databases — **_Schema, Querying, Replication, Partitioning and Transaction Isolation_**.

## Schema

Saying that NoSQL Databases have no schema is not entirely correct. Data in NoSQL is generally stored in JSON or XML format and is usually parsed into a fixed schema when read by an application. Therefore, rather than saying schema-less, we can refer to **_NoSQL databases as having schema-on-read_**.

Conversely, modern SQL Databases can provide us with schema-flexibility similar to that of NoSQL. We have the **_ALTER TABLE SQL_** command to easily change the schema if required. Newer versions of **_SQL databases support the JSON attribute type_**, which lets us store unstructured data in a relational table.

## Querying

Data from SQL Databases is primarily retrieved via **_SQL Queries_**.

In most NoSQL databases, the typical way to retrieve data is through **_the associated Document ID_** because basicly you store everything in a document and just use simple query, you usually not joining tables. However, many modern NoSQL databases support SQL-like querying. NoSQL Databases typically use Secondary Indexes to query unstructured data.

## Partitioning and Replication

Partitioning is the concept of splitting up a database into multiple components called partitions which can be then distributed among several machines.

Replication is the concept of storing multiple copies of the same partition across different machines. This gives the database durability and availability in case of failure in a single machine.

Most NoSQL databases were designed with the concepts of Distributed Data Systems in mind, and therefore have these features by default, whereas **_most SQL databases were designed to be run on a single machine_**.

That being said, there is nothing stopping an SQL database from having Replication and Partitioning as features. In fact, Teradata, a Relational Database built in the 1970s, has partitioning as one of its key features. Many relational databases today have the features of Distributed Data Systems like replication and partitioning.

## Transaction Isolation

A transaction is a sequence of operations performed (read, write,...)

Transaction Isolation is a concern which comes into the picture when multiple transactions are running on a database at the same time. The problem arises due to multi-threaded execution and is made worse by Replication and Partitioning.

Why it matters? It can prevent Dirty Read, Non Repeatable read, Phantom Read,... [See more](https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/#:~:text=Based%20on%20these%20phenomena%2C%20The,transaction%2C%20thereby%20allowing%20dirty%20reads.&text=Serializable%20%E2%80%93%20This%20is%20the%20Highest%20isolation%20level.)

How can we execute multiple transactions parallelly on a database such that each database transaction produces a result that is logically sound. Databases attempt to solve this problem by providing Transaction Isolation Guarantees. These range from **_weak guarantees_** like Read Committed, where only individual reads and writes are covered, to **_Serializability_**, which guarantees that every transaction is executed such that it effectively looks like they took place one after the other, and some in between.

SQL databases are typically associated with strong Transaction Isolation, whereas NoSQL is associated with weak Transaction Isolation.

# How do I decide which database is best suited to my application?

Main comparision:

| Use                                                                                               | SQL                                                                                                                          | NoSQL                                                                                                                            |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Schema                                                                                            | Know exactly the structure of the table and query result (**_Strict schema_**)                                               | Don't want strict, store what ever I like or semi-structured data (**_dynamic schemas_**)                                        |
| Design in mind                                                                                    | [ACID](https://en.wikipedia.org/wiki/ACID) (Atomicity, Consistency, Isolation, Durability)                                   | [BASE](https://www.lifewire.com/abandoning-acid-in-favor-of-base-1019674) (Basic Availability, Soft state, Eventual consistency) |
| [Data model](https://www.tutorialspoint.com/difference-between-normalization-and-denormalization) | Normalize (Focus on reducing unused data and duplicate data by using many tables and relations)                              | Denormalize (Combine multiple table data into one so that it can be queried quickly)                                             |
| Query                                                                                             | Can write complex query using SQL (but yuh, it's slow)                                                                       | Not using complex query, the premise of joins is nonexistent, store everything in one document and just use simple query         |
| Scale                                                                                             | Vertical scale (Use resources (CPU, RAM, storage) in one single machine very efficiency), designed to run on a single server | Horizontal scale (run well on multiple cluster / server), better when storing big chunk of data                                  |
| Multi-row transactions                                                                            | _Serializability_ transaction isolation                                                                                      | _Weak guarantees_                                                                                                                |

In short, the performance will be x10 faster in the NoSQL world, not because it use "nasa" technology, just because lyou're using 10 times less calls to the database layer, that's it. SQL is for structured data, you want to know what you have and what you will get, and guaranty that multi-row transactions happen in the right order.

# Graph Database

It's worth to mention graph database (graph the data)

Very simply, a graph database is a database designed to treat the relationships between data as equally important to the data itself. It is intended to hold data without constricting it to a pre-defined model. Instead, the data is stored like we first draw it out - showing how each individual entity connects with or is related to others.
