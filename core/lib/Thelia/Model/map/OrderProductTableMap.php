<?php

namespace Thelia\Model\map;

use \RelationMap;
use \TableMap;


/**
 * This class defines the structure of the 'order_product' table.
 *
 *
 *
 * This map class is used by Propel to do runtime db structure discovery.
 * For example, the createSelectSql() method checks the type of a given column used in an
 * ORDER BY clause to know whether it needs to apply SQL to make the ORDER BY case-insensitive
 * (i.e. if it's a text column type).
 *
 * @package    propel.generator.Thelia.Model.map
 */
class OrderProductTableMap extends TableMap
{

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = 'Thelia.Model.map.OrderProductTableMap';

    /**
     * Initialize the table attributes, columns and validators
     * Relations are not initialized by this method since they are lazy loaded
     *
     * @return void
     * @throws PropelException
     */
    public function initialize()
    {
        // attributes
        $this->setName('order_product');
        $this->setPhpName('OrderProduct');
        $this->setClassname('Thelia\\Model\\OrderProduct');
        $this->setPackage('Thelia.Model');
        $this->setUseIdGenerator(true);
        // columns
        $this->addForeignPrimaryKey('ID', 'Id', 'INTEGER' , 'order_feature', 'ORDER_PRODUCT_ID', true, null, null);
        $this->addColumn('ORDER_ID', 'OrderId', 'INTEGER', true, null, null);
        $this->addColumn('PRODUCT_REF', 'ProductRef', 'VARCHAR', false, 255, null);
        $this->addColumn('TITLE', 'Title', 'VARCHAR', false, 255, null);
        $this->addColumn('DESCRIPTION', 'Description', 'LONGVARCHAR', false, null, null);
        $this->addColumn('CHAPO', 'Chapo', 'LONGVARCHAR', false, null, null);
        $this->addColumn('QUANTITY', 'Quantity', 'FLOAT', true, null, null);
        $this->addColumn('PRICE', 'Price', 'FLOAT', true, null, null);
        $this->addColumn('TAX', 'Tax', 'FLOAT', false, null, null);
        $this->addColumn('PARENT', 'Parent', 'INTEGER', false, null, null);
        $this->addColumn('CREATED_AT', 'CreatedAt', 'TIMESTAMP', true, null, null);
        $this->addColumn('UPDATED_AT', 'UpdatedAt', 'TIMESTAMP', true, null, null);
        // validators
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
        $this->addRelation('OrderFeature', 'Thelia\\Model\\OrderFeature', RelationMap::MANY_TO_ONE, array('id' => 'order_product_id', ), 'CASCADE', 'RESTRICT');
        $this->addRelation('Order', 'Thelia\\Model\\Order', RelationMap::ONE_TO_ONE, array('order_id' => 'id', ), 'CASCADE', 'RESTRICT');
    } // buildRelations()

} // OrderProductTableMap