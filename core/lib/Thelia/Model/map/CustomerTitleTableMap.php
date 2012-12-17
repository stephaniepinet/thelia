<?php

namespace Thelia\Model\map;

use \RelationMap;
use \TableMap;


/**
 * This class defines the structure of the 'customer_title' table.
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
class CustomerTitleTableMap extends TableMap
{

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = 'Thelia.Model.map.CustomerTitleTableMap';

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
        $this->setName('customer_title');
        $this->setPhpName('CustomerTitle');
        $this->setClassname('Thelia\\Model\\CustomerTitle');
        $this->setPackage('Thelia.Model');
        $this->setUseIdGenerator(true);
        // columns
        $this->addForeignPrimaryKey('ID', 'Id', 'INTEGER' , 'address', 'CUSTOMER_TITLE_ID', true, null, null);
        $this->addForeignPrimaryKey('ID', 'Id', 'INTEGER' , 'customer', 'CUSTOMER_TITLE_ID', true, null, null);
        $this->addForeignPrimaryKey('ID', 'Id', 'INTEGER' , 'customer_title_desc', 'CUSTOMER_TITLE_ID', true, null, null);
        $this->addColumn('DEFAULT_UTILITY', 'DefaultUtility', 'INTEGER', true, null, 0);
        $this->addColumn('POSITION', 'Position', 'VARCHAR', true, 45, null);
        $this->addColumn('CREATED_AT', 'CreatedAt', 'TIMESTAMP', true, null, null);
        $this->addColumn('UPDATED_AT', 'UpdatedAt', 'TIMESTAMP', true, null, null);
        // validators
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
        $this->addRelation('Address', 'Thelia\\Model\\Address', RelationMap::MANY_TO_ONE, array('id' => 'customer_title_id', ), 'RESTRICT', 'RESTRICT');
        $this->addRelation('Customer', 'Thelia\\Model\\Customer', RelationMap::MANY_TO_ONE, array('id' => 'customer_title_id', ), 'SET NULL', 'RESTRICT');
        $this->addRelation('CustomerTitleDesc', 'Thelia\\Model\\CustomerTitleDesc', RelationMap::MANY_TO_ONE, array('id' => 'customer_title_id', ), 'CASCADE', null);
    } // buildRelations()

} // CustomerTitleTableMap