Class('KiokuJS.TypeMap.Joose', {
    
    isa     : 'KiokuJS.TypeMap',
    
    use     : [ 'KiokuJS.Aspect.AfterCollapse', 'KiokuJS.Feature.Attribute.Skip' ],
    
    
    has : {
        forClass    : 'Joose.Proto.Object',
        inherit     : false
    },
    
        
    methods : {
        
        acquireID : function (node, desiredId) {
            var instance        = node.object
            
            if (instance.meta.does('KiokuJS.Feature.Class.OwnID')) return instance.acquireID(desiredId, node)
            
            return this.SUPER(node, desiredId)
        },
        
        
        eachAttribute : function (instance, func, scope) {
            var meta            = instance.meta
            
            var scanAttribute = function (attribute, name) {
                var attributeLevel = attribute instanceof Joose.Managed.Attribute ? 2 : attribute instanceof Joose.Managed.Property.Attribute ? 1 : 0
                
                if (attributeLevel == 2 && attribute.meta.does(KiokuJS.Feature.Attribute.Skip)) return
                
                func.call(scope || null, attribute, name, attributeLevel)
            }
            
            if (meta instanceof Joose.Managed.Class)
                meta.getAttributes().each(scanAttribute)
            else
                Joose.O.each(meta.attributes, scanAttribute)
        },
        
        
        collapse : function (node, collapser) {
            var instance        = node.object
            var meta            = instance.meta
            var data            = {}
            
            this.eachAttribute(instance, function (attribute, name, attributeLevel) {
                
                if (attributeLevel) {
                    data[ name ] = collapser.visit(attribute.getRawValueFrom(instance))
                    
                    if (attributeLevel == 2 && attribute.meta.does(KiokuJS.Aspect.AfterCollapse)) attribute.afterCollapse(instance, data[ name ], node, collapser)
                    
                } else
                    // Joose.Proto.Class attributes - just raw values
                    data[ name ] = collapser.visit(instance[ name ])
            })
            
            
            // instance has traits
            if (meta.isDetached) node.classTraits = Joose.A.map(meta.getRoles(), function (trait) {
                var traitName = trait.meta.name
                
                if (!traitName) throw "Can't serialize instance [" + instance + "] - it contains an anonymous trait"
                
                return trait.meta.VERSION ? {
                    type    : 'joose',
                    token   : traitName,
                    version : trait.meta.VERSION
                } : traitName
            })
            
            node.classVersion = meta.VERSION
            
            if (meta instanceof Joose.Managed.Class && meta.does(KiokuJS.Aspect.AfterCollapse)) instance.afterCollapse(node, collapser)
            
            return data
        },
        
        
        clearInstance : function (node) {
            var instance        = node.object
            
            this.eachAttribute(instance, function (attribute, name, attributeLevel) {
                
                if (attributeLevel)
                    delete instance[ attribute.slot ]
                else
                    // Joose.Proto.Class attributes - just raw values
                    delete instance[ attribute.name ]
            })
        },
        
        
        createEmptyInstance : function (node) {
            var constructor     = node.getClass()
            
            var classVersion = constructor.meta.VERSION
            
            if (this.isVersionExact && classVersion && classVersion != node.classVersion) 
                throw "Typemap [" + this + "] handles only exact version [" + classVersion + "] of class [" + node.className + ']'
            
            if (node.classTraits) {
                var traits = Joose.A.map(node.classTraits, function (traitOrDesc) {
                    if (typeof traitOrDesc == 'string') return eval(traitOrDesc)
                    
                    return eval(traitOrDesc.token)
                })
                
                constructor = constructor.meta.subClass({
                    does : traits 
                }, node.className)
                
                constructor.meta.isDetached = true
            }
            
            var f               = function () {}
            f.prototype         = constructor.prototype
            
            return new f()
        },
        
        
        populate : function (node, expander) {
            var instance        = node.object
            var data            = node.data
            
            // now that instance for `node.ID` is already pinned and we can assign its attributes (which can contain 
            // self-references for example)
            this.eachAttribute(instance, function (attribute, name, attributeLevel) {
                
                if (attributeLevel)
                    attribute.setRawValueTo(instance, expander.visit(data[ name ]))
                else
                    // Joose.Proto.Class attributes - just raw values
                    instance[ attribute.name ] = expander.visit(data[ name ])
                
            })
        }
    }

})
