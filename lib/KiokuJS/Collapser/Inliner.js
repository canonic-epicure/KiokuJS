/**
 * This class visits the data structure and inlines the KiokuJS.Node.
 * Inlining means the replacing with the KiokuJS.Reference instance (or other object, recognized by serializer)
 */

Class('KiokuJS.Collapser.Inliner', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    methods : {
        
        visitFirstClassNode : function (node) {
            return new KiokuJS.Reference({
                ID : node.ID
            })
        },
        
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof KiokuJS.Node)) throw "Invalid Joose instance [" + node + "] encountered during inlining"
            
            if (node.isFirstClass()) return this.visitFirstClassNode(node)
            
            return node.getEntry()
        },
        
        
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value, index) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    }
})